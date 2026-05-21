$ErrorActionPreference = 'Stop'

$root = (Get-Location).Path
$base = Join-Path $root 'demo-output/agentpay-founder-demo'
$slides = Join-Path $base 'slides'
$videoDir = Join-Path $base 'video'
$audio = Join-Path $base 'audio/voiceover.wav'
$scenesPath = Join-Path $root 'docs/demo/generated/AGENTPAY_FOUNDER_DEMO_SCENES.json'
$concatFile = Join-Path $videoDir 'slides.txt'
$mp4 = Join-Path $videoDir 'agentpay-founder-demo.mp4'
$tempVideo = Join-Path $videoDir 'slides-only.mp4'

New-Item -ItemType Directory -Force -Path $videoDir | Out-Null

Remove-Item -Force -ErrorAction SilentlyContinue $concatFile, $tempVideo, $mp4

if (-not (Test-Path $scenesPath)) {
  throw "Scenes file missing: $scenesPath"
}

$scenesJson = Get-Content -Raw $scenesPath | ConvertFrom-Json
$sceneList = @($scenesJson.scenes)
if ($sceneList.Count -eq 0) {
  throw "No scenes found in $scenesPath"
}

$timelineSeconds = 0.0
foreach ($scene in $sceneList) {
  $timelineSeconds += [double]$scene.duration
}

if ($timelineSeconds -gt 300) {
  throw "Timeline exceeds hard max 300s ($timelineSeconds s). Update docs/demo/generated/AGENTPAY_FOUNDER_DEMO_SCENES.json"
}

$ffmpegAvailable = $false
try {
  & ffmpeg -version *> $null
  $ffmpegAvailable = $true
} catch {
  $ffmpegAvailable = $false
}

if (-not $ffmpegAvailable) {
  Write-Output "FFMPEG_MISSING: Install FFmpeg and re-run this script."
  Write-Output "Expected script: node scripts/demo-video/build-storyboard-slides.mjs"
  exit 0
}

function Get-ExistingSlides([string]$extension) {
  $result = @()
  foreach ($scene in $sceneList) {
    $p = Join-Path $slides ("scene-{0}.{1}" -f $scene.id, $extension)
    if (Test-Path $p) {
      $result += [PSCustomObject]@{ Path = $p; Duration = [double]$scene.duration }
    }
  }
  return ,$result
}

$pngSlides = Get-ExistingSlides -extension 'png'
$svgSlides = @()
$slideType = $null
$selectedSlides = @()

if ($pngSlides.Count -gt 0) {
  $selectedSlides = $pngSlides
  $slideType = 'png'
} else {
  $svgSlides = Get-ExistingSlides -extension 'svg'
  if ($svgSlides.Count -gt 0) {
    $selectedSlides = $svgSlides
    $slideType = 'svg'
  }
}

if ($selectedSlides.Count -eq 0) {
  Write-Output "SLIDES_MISSING: No scene-XX.png or scene-XX.svg found in $slides"
  Write-Output "Run: node scripts/demo-video/build-storyboard-slides.mjs"
  exit 1
}

$lines = @()
foreach ($s in $selectedSlides) {
  $esc = $s.Path.Replace("'", "''")
  $lines += "file '$esc'"
  $lines += "duration $($s.Duration)"
}
Set-Content -Encoding UTF8 -Path $concatFile -Value ($lines -join "`n")
if ($PSVersionTable.PSVersion.Major -ge 6) {
  [System.IO.File]::WriteAllText($concatFile, ($lines -join "`n"), [System.Text.UTF8Encoding]::new($false))
} else {
  [System.IO.File]::WriteAllText($concatFile, ($lines -join "`n"), (New-Object System.Text.UTF8Encoding $false))
}

if ($slideType -eq 'png') {
  & ffmpeg -y -f concat -safe 0 -i $concatFile -fps_mode vfr -pix_fmt yuv420p -vf "fps=30,format=yuv420p" $tempVideo | Out-Null
} else {
  try {
    & ffmpeg -y -f concat -safe 0 -i $concatFile -fps_mode vfr -pix_fmt yuv420p -vf "fps=30,format=yuv420p" $tempVideo | Out-Null
  } catch {
    Write-Output "SVG_UNSUPPORTED_BY_FFMPEG: Could not render SVG slides to video on this machine."
    Write-Output "Fallback: render PNG slides first via node scripts/demo-video/build-storyboard-slides.mjs on a machine with Playwright, then re-run this script."
    exit 1
  }
}

if ($LASTEXITCODE -ne 0 -or -not (Test-Path $tempVideo)) {
  throw "FFmpeg failed to render slide timeline from $slideType inputs. See output above."
}

if (Test-Path $audio) {
  $audioDuration = 0.0
  try {
    $audioDurationRaw = & ffprobe -v error -show_entries format=duration -of default=noprint_wrappers=1:nokey=1 $audio
    $audioDuration = [double]$audioDurationRaw
  } catch {}

  if ($audioDuration -gt $timelineSeconds) {
    Write-Output "AUDIO_LONGER_THAN_TIMELINE: audio=${audioDuration}s timeline=${timelineSeconds}s. Building video anyway; manual trimming may be needed."
  }

  & ffmpeg -y -i $tempVideo -i $audio -c:v copy -c:a aac $mp4 | Out-Null
  if ($LASTEXITCODE -ne 0 -or -not (Test-Path $mp4)) {
    throw "FFmpeg failed to mux audio into $mp4"
  }
  Write-Output "VIDEO_OK_WITH_AUDIO: $mp4"
  Write-Output "SLIDE_INPUT_TYPE: $slideType"
  Write-Output "TIMELINE_SECONDS: $timelineSeconds"
} else {
  Copy-Item -Force $tempVideo $mp4
  Write-Output "VIDEO_OK_SLIDES_ONLY: $mp4"
  Write-Output "SLIDE_INPUT_TYPE: $slideType"
  Write-Output "TIMELINE_SECONDS: $timelineSeconds"
}
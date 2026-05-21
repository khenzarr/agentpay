$ErrorActionPreference = 'Stop'

$root = (Get-Location).Path
$base = Join-Path $root 'demo-output/agentpay-founder-demo/audio'
$source = Join-Path $root 'docs/demo/generated/AGENTPAY_FOUNDER_DEMO_VOICEOVER.md'
$txt = Join-Path $base 'voiceover.txt'
$wav = Join-Path $base 'voiceover.wav'
$manual = Join-Path $base 'manual-ttsmaker-guide.md'

New-Item -ItemType Directory -Force -Path $base | Out-Null

$content = Get-Content -Raw $source
Set-Content -Encoding UTF8 -Path $txt -Value $content

try {
  Add-Type -AssemblyName System.Speech
  $synth = New-Object System.Speech.Synthesis.SpeechSynthesizer
  $synth.SelectVoiceByHints([System.Speech.Synthesis.VoiceGender]::Female)
  $synth.Rate = -3
  $synth.Volume = 100
  $synth.SetOutputToWaveFile($wav)
  $synth.Speak($content)
  $synth.Dispose()
  Write-Output "TTS_OK: $wav"
} catch {
  @"
# Manual TTSMaker Guide

- TTSMaker Free web UI may be used manually.
- Do not use the TTSMaker API unless a valid paid PRO/STUDIO key is explicitly provided.
- Paste `voiceover.txt` into the web UI manually.
- Download WAV or MP3 manually and save it as `voiceover.wav` here.
- Do not automate the website.

Source text: `voiceover.txt`
"@ | Set-Content -Encoding UTF8 $manual
  Write-Output "TTS_FALLBACK: manual guide written"
}

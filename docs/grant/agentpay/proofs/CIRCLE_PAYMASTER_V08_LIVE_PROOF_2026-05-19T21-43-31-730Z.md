# Circle Paymaster v0.8 Live Proof Artifact

- generatedAt: 2026-05-19T21:43:31.732Z
- network: ARC-TESTNET
- chainId: 5042002
- ownerAddress: 0x9c90f57b4D7DA490798AdBCA69bD878E9A10ACBC
- expectedAddressMatched: yes
- entryPointVersion: v0.8
- entryPointAddress: 0x4337084D9E255Ff0702461CF8895CE9E3b5Ff108
- paymasterAddress: 0x3BA9A96eE3eFf3A69E2B18886AcF52027EFF8966
- usdcAddress: 0x3600000000000000000000000000000000000000
- tokenName: USDC
- tokenVersion: 2
- tokenDecimals: 6
- ownerBalance: 38949047
- ownerBalanceFormatted: 38.949047
- allowanceToPaymaster: 0
- permitAmountRaw: 10000
- transferAmountRaw: 1000
- transferTo: 0x9c90f57b4D7DA490798AdBCA69bD878E9A10ACBC
- permitSignatureLength: 132
- permitSignaturePrefix: 0x4f73f874
- paymasterDataLength: 238
- userOpHash: N/A
- txHash: N/A
- success: unknown
- logsCount: 0
- proofStatus: FAILED_BEFORE_USEROPHASH
- errorSummary: UserOperationExecutionError: The Paymaster contract has not been deployed.

Request Arguments:
  callData:                       0xb61d27f60000000000000000000000003600000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000600000000000000000000000000000000000000000000000000000000000000044a9059cbb0000000000000000000000009c90f57b4d7da490798adbca69bd878e9a10acbc00000000000000000000000000000000000000000000000000000000000003e800000000000000000000000000000000000000000000000000000000
  callGasLimit:                   0
  factory:                        0x7702
  factoryData:                    0x
  nonce:                          32820945318955960843925268201472
  paymaster:                      0x3BA9A96eE3eFf3A69E2B18886AcF52027EFF8966
  paymasterData:                  0x00360000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000027104f73f8745c7beb132462e6a70f7a0c243d73885699cd3ef02bfb9d253e671f8236f51f0efe6e4235571361752327ecaa2cd1f17e2d1fc8b6099bb2921d928c081c
  paymasterPostOpGasLimit:        120000
  paymasterVerificationGasLimit:  250000
  preVerificationGas:             0
  sender:                         0x9c90f57b4D7DA490798AdBCA69bD878E9A10ACBC
  signature:                      0xfffffffffffffffffffffffffffffff0000000000000000000000000000000007aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa1c
  verificationGasLimit:           0

Details: UserOperation reverted during simulation with reason: AA30 paymaster not deployed
Version: viem@2.49.3

## Receipt summary
```json
unavailable
```
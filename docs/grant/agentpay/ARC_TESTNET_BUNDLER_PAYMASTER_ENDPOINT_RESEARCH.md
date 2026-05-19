# ARC Testnet Bundler + Paymaster Endpoint Research — AgentPay

##1. Purpose

Record a conservative, non-mutating research result for raw ERC-4337 readiness on `ARC-TESTNET`.

Scope:

- discovery only
- no live userOperations
- no sponsored transfers
- no wallet creation
- no secrets

##2. Current known state

- Paymaster: `NOT_CLAIMED`
- Gasless: `NOT_CLAIMED`
- Raw ERC-4337: infra/readiness only
- Verified Circle SCA wallet exists on `ARC-TESTNET`
 - `walletId`: `494ad75a-4d03-5021-9ddb-0c70cf566954`
 - `walletAddress`: `0x61df32dfe83e36bf54bd3e43181919bb2130ca72`
 - `accountType`: `SCA`
 - `state`: `LIVE`

##3. Arc native bundler finding

- No Arc-native bundler RPC endpoint is verified in the allowed repo evidence.
- Raw ERC-4337 needs a bundler transport URL to construct and submit userOperations.
- Result: bundler availability remains unproven for ARC-TESTNET.

##4. Circle Paymaster service/data finding

- Circle Paymaster ARC-TESTNET contract addresses are known.
- Circle Paymaster v0.8 quickstart documents a local `getPaymasterData()` path:
  - sign EIP-2612 permit
  - `encodePacked(["uint8","address","uint256","bytes"], [0, usdcAddress, permitAmount, permitSignature])`
  - return `paymaster`, `paymasterData`, `paymasterVerificationGasLimit`, `paymasterPostOpGasLimit`, `isFinal`
- This means paymaster data can be constructed locally for the documented viem quickstart path.
- A separate `CIRCLE_PAYMASTER_SERVICE_URL` is not yet proven required for that specific v0.8 quickstart path.
- Result: paymaster data path is feasible via local permit path (not yet runtime-proven on AgentPay Arc flow).

##5. EntryPoint v0.8/v0.7 finding

- Default target: `v0.8`
- Fallback target: `v0.7`
- The known Circle paymaster addresses cover both versions.
- Runtime choice still depends on bundler and paymaster compatibility.

##6. External provider matrix

| Provider | Finding | Status |
|---|---|---|
| Circle | Paymaster addresses known; v0.8 quickstart shows local permit-based paymaster data path; still needs runtime proof and SCA compatibility confirmation | `FEASIBLE_PAYMASTER_DATA_LOCAL_PERMIT_PATH` |
| Arc native infra | No verified native bundler endpoint in current evidence | `BLOCKED_NO_BUNDLER` |
| Pimlico | Could be an external bundler/paymaster candidate, but not verified here for ARC-TESTNET | `FEASIBLE_BUT_NEEDS_PROVIDER_ACCOUNT` |
| Stackup | Could be an external bundler/paymaster candidate, but not verified here for ARC-TESTNET | `FEASIBLE_BUT_NEEDS_PROVIDER_ACCOUNT` |
| Alchemy | Could be an external bundler/paymaster candidate, but not verified here for ARC-TESTNET | `FEASIBLE_BUT_NEEDS_PROVIDER_ACCOUNT` |
| Biconomy | Could be an external bundler/paymaster candidate, but not verified here for ARC-TESTNET | `FEASIBLE_BUT_NEEDS_PROVIDER_ACCOUNT` |

##7. Circle SCA raw ERC-4337 compatibility finding

- The Circle-created SCA wallet is verified and live.
- The raw ERC-4337 path still lacks confirmed smart-account metadata.
- Missing pieces include implementation/factory details, signer mapping, and deterministic userOp signing semantics.
- Result: SCA existence alone does not prove raw AA compatibility.

##8. Minimum viable proof path if infra exists

1. Resolve bundler RPC for `ARC-TESTNET`.
2. Use documented local permit-based paymaster data construction path (or equivalent proven path).
3. Confirm EntryPoint version/address.
4. Confirm Circle SCA metadata/signing compatibility.
5. Submit one tiny sponsored userOperation only after explicit approval.
6. Capture `userOpHash`, `txHash`, receipt, finality, and paymaster correlation.

##9. Blocked path if infra unavailable

- No bundler RPC: raw ERC-4337 cannot start.
- No usable paymaster data path (local or service): sponsored proof cannot be constructed.
- No SCA metadata/signing path: userOperation cannot be proven deterministically.
- In this state, claim boundary stays unchanged.

##10. Required env vars

- `ARC_BUNDLER_RPC_URL`
- `CIRCLE_PAYMASTER_ADDRESS`
- `CIRCLE_PAYMASTER_VERSION`
- `RAW_ERC4337_ENTRYPOINT_VERSION`
- `RAW_ERC4337_ENTRYPOINT_ADDRESS`
- `CIRCLE_SCA_WALLET_ID`
- `CIRCLE_SCA_WALLET_ADDRESS`

##11. Required proof artifacts

- `userOpHash`
- `txHash`
- final status/finality
- paymaster address used
- EntryPoint version/address used
- userOp receipt or bundler receipt correlation
- paymaster event/log correlation
- sponsored fee evidence
- `ARC-TESTNET` network marker

##12. Final recommendation

Keep Paymaster/Gasless `NOT_CLAIMED`.

Treat raw ERC-4337 as **blocked for proof** until bundler RPC and Circle SCA metadata/signing compatibility are verified, and the local paymaster-data path is validated on the target runtime.

##13. Claim boundary

- Paymaster: `NOT_CLAIMED`
- Gasless: `NOT_CLAIMED`
- classification: `DO_NOT_CLAIM`

## Final classification

- `BLOCKED_NO_BUNDLER`
- `FEASIBLE_PAYMASTER_DATA_LOCAL_PERMIT_PATH`
- `BLOCKED_CIRCLE_SCA_RAW_COMPATIBILITY`
- `FEASIBLE_BUT_NEEDS_PROVIDER_ACCOUNT`
- `DO_NOT_CLAIM`

##14. Circle v0.8 quickstart compatibility note

- The Circle Paymaster v0.8 quickstart account path uses viem `toSimple7702SmartAccount`.
- This may not map directly to the existing Circle-created Developer-Controlled SCA wallet path in this repo.
- Bundler requirement remains unchanged (`createBundlerClient` still required).
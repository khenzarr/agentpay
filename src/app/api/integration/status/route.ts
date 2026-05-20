import { jsonOk } from "@/lib/api-response";
import {
  ARC_TESTNET_CHAIN_ID,
  getCirclePaymasterSupportStatus,
} from "@/lib/circle-paymaster-support";

export async function GET() {
  const paymaster = getCirclePaymasterSupportStatus(ARC_TESTNET_CHAIN_ID);

  return jsonOk({
    statuses: {
      arcTestnetExecution: "CURRENT_VERIFIED",
      usdcEscrowJobLifecycle: "CURRENT_VERIFIED",
      arcnsIdentityDisplayResolution: "CURRENT_VERIFIED",
      circleWalletsEoaCreateReadSignSend: "CURRENT_VERIFIED",
      circleWalletsScaWalletCreation: "CURRENT_VERIFIED",
      gatewayUnifiedBalance: "CURRENT_CODE_IMPLEMENTED_SPEND_ESTIMATE_VERIFIED",
      circlePaymasterGaslessClientSideReadiness: "READINESS_COMPLETE_CLIENT_SIDE",
      paymasterGaslessOnArcTestnet: "NOT_CLAIMED",
      mainnetReadiness: "NOT_CLAIMED",
      fullErc8183Compliance: "NOT_CLAIMED",
      fullErc8004Compliance: "NOT_CLAIMED",
      productionSdkApi: "NOT_CLAIMED",
    },
    paymaster: {
      chainId: ARC_TESTNET_CHAIN_ID,
      label: paymaster.label,
      status: paymaster.status,
      detail: paymaster.detail,
    },
    readOnly: true,
  });
}

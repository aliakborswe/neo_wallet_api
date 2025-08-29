import mongoose from "mongoose";
import { User } from "../user/user.model";
import { CommissionHistory } from "./agent.commission.model";
import { JwtPayload } from "jsonwebtoken";

const commissionHistory = async (
  agentId: mongoose.Types.ObjectId,
  amount: number
) => {
  const agent = await User.findOne({ _id: agentId });
  // agent commission logic
  const agentCommissionRate = Number(agent?.agentInfo?.commissionRate);

  const agentCommission = (amount / 1000) * agentCommissionRate;
  await CommissionHistory.create([
    {
      agentId,
      commission: agentCommission,
    },
  ]);

  if (
    agent &&
    agent.agentInfo &&
    typeof agent.agentInfo.totalCommission === "number"
  ) {
    agent.agentInfo.totalCommission += agentCommission;
  }
  await agent?.save();
};

// get commission history
const myCommissionHistory = async (payload: JwtPayload) => {
  const commissions = await CommissionHistory.find({ agentId: payload.userId });
  return {
    data: commissions,
  };
};

export const AgentCommissionHistory = {
  commissionHistory,
  myCommissionHistory,
};

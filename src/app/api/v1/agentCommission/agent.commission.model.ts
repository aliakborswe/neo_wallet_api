import { model, Schema } from "mongoose";

const agentCommissionSchema = new Schema(
  {
    agentId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    commission: {
      type: Number,
      default: 0,
      required: true,
      get: (value: number) => value / 100, // convert paisa → currency
      set: (value: number) => value * 100, // balance store in paisa
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

export const CommissionHistory = model(
  "CommissionHistory",
  agentCommissionSchema
);

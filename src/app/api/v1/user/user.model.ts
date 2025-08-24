import { model, Schema } from "mongoose";
import { UserStatus, IUser, Role, AgentStatus } from "./user.interface";

export const agentInfoSchema = new Schema(
  {
    commissionRate: { type: Number }, // in percentage
    approvalStatus: {
      type: String,
      enum: Object.values(AgentStatus),
    },
  },
  { _id: false, versionKey: false }
);

const userSchema = new Schema<IUser>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    phone: { type: String, required: true, unique: true, maxLength: 14 },
    picture: { type: String },
    address: { type: String },
    userStatus: {
      type: String,
      enum: Object.values(UserStatus),
      default: UserStatus.ACTIVE,
    },
    isDeleted: { type: Boolean, default: false },
    isVerified: { type: Boolean, default: false },
    role: { type: String, enum: Object.values(Role), default: Role.USER },
    agentInfo: {
      commissionRate: {
        type: Number,
        get: (value: number) => value / 100,
        set: (value: number) => value * 100,
      },
      approvalStatus: { type: String },
      totalCommission: {
        type: Number,
        get: (value: number) => value / 100,
        set: (value: number) => value * 100,
      },
      txnfees: {
        type: Number,
        get: (value: number) => value / 100,
        set: (value: number) => value * 100,
      },
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

export const User = model<IUser>("User", userSchema);

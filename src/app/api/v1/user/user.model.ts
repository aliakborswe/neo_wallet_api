import { model, Schema } from "mongoose";
import { UserStatus, IUser, Role, AgentStatus } from "./user.interface";

export const agentInfoSchema = new Schema({
  commissionRate: { type: Number , default: 1.5}, // in percentage
  approvalStatus: {
    type: String,
    enum: Object.values(AgentStatus),
    default: AgentStatus.PENDING,
  },
});

const userSchema = new Schema<IUser>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    phone: { type: String, required: true },
    picture: { type: String },
    address: { type: String },
    userStatus: {
      type: String,
      enum: Object.values(UserStatus),
      default: UserStatus.ACTIVE,
    },
    isVerified: { type: Boolean, default: false },
    role: { type: String, enum: Object.values(Role), default: Role.USER },
    agentInfo: {
      type: agentInfoSchema,
      default: () => ({}), // Default to an empty object if no agentInfo is provided
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

export const User = model<IUser>("User", userSchema);
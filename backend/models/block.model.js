import mongoose, { Schema } from "mongoose";

const blockSchema = new Schema(
  {
    blockedUser: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    blockedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Export as Block model, not User
export const Block = mongoose.model("Block", blockSchema);
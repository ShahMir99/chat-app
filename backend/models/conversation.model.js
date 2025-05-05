import mongoose, { Schema } from "mongoose";

const conversationSchema = new Schema(
  {
    participants: [
      {
        userId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },
      },
    ],
    isGroupchat: {
      type: Boolean,
      default: false,
    },
    groupName: {
      type: String,
      trim: true,
      default: null,
    },
    groupAdmin: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    lastMessage: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Message",
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

conversationSchema.index({ "participants.userId": 1 });

export const Conversation = mongoose.model("Conversation", conversationSchema);

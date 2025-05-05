import mongoose, { Schema } from "mongoose";

const messageSchema = new Schema(
  {
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    content: {
      type: String,
      default : "A new Conversation has been started...", 
      trim: true,
    },
    messageType: {
      type: String,
      enum: ["text", "image", "file", "video", "audio"],
      default: "text",
    },
    conversation: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Conversation",
      required: true,
    },
    readBy: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    attachments: [
      {
        fileUrl: String,
        fileType: String,
        fileName: String,
      },
    ],
  },
  {
    timestamps: true,
  }
);

messageSchema.index({ conversation: 1 });

export const Message = mongoose.model("Message", messageSchema);

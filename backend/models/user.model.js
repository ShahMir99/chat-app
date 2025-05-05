import mongoose, { Schema } from "mongoose";

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      unique: true,
      required: [true, "Email is required!"],
    },
    password: {
      type: String,
      required: [true, "Please is required!"],
    },
    lastSeen: {
      type: Date,
      default: null,
    },
    bio: {
      type: String,
      default: "Hi There !",
    },
    profilePic: {
      type: String,
      default: null,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
    isBlocked: {
      type: Boolean,
      default: false,
    },
    resetPasswordToken: String,
    resetPasswordTokenExpires: Date,
    emailVerificationToken: String,
    emailVerificationTokenExpires: Date,
  },
  {
    timestamps: true,
  }
);

export const User = mongoose.model("User", userSchema);

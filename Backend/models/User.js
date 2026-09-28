import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      default: null,
    },

    googleId: {
      type: String,
      unique: true,
      sparse: true,
      default: undefined,
    },

    isEmailVerified: {
      type: Boolean,
      default: false,
    },

    emailVerificationCode: {
      type: String,
      default: null,
    },

    emailVerificationExpires: {
      type: Date,
      default: null,
    },

    emailVerificationLastSent: {
      type: Date,
      default: null,
    },

    emailVerificationResendCount: {
      type: Number,
      default: 0,
    },

    emailVerificationResendReset: {
      type: Date,
      default: null,
    },

    emailVerificationAttempts: {
        type: Number,
        default: 0,
    },

    resumeName: {
      type: String,
      default: null,
    },

    resume: {
      type: String,
      default: null,
    },

    resumePublicId: {
      type: String,
      default: null,
    },

    resumeResourceType: {
      type: String,
      default: null,
    },

    parsedResume: {
      type: Object,
      default: null,
    },
    resumeAnalysis: {
      type: Object,
      default: null,
    },
  },
  {
    timestamps: true,
  },
);

const User = mongoose.model("User", userSchema);

export default User;

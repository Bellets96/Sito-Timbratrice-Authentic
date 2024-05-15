import mongoose from "mongoose";

const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    discordId: {
      type: String,
      required: true,
    },
    role: {
      type: Array,
      required: true,
    },
    username: {
      type: String,
      required: true,
    },
    usernameic: {
      type: String,
      required: false,
    },
    isAdmin: {
      type: Boolean,
      required: true,
    },
  },
  { timestamps: true }
);

export const User = mongoose.model("User", userSchema);

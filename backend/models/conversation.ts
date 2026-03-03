import mongoose, { model, Schema } from "mongoose";
import type { ConversationProps } from "../types.ts";

const ConversationSchema = new Schema<ConversationProps>({
    type: {
        type: String,
        enum: ["direct", "group"],
        required: true,
    },
    name: String,
    participants: [{
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
    }],
    lastMessage: {
        type: Schema.Types.ObjectId,
        ref: "Message",
    } ,
    avatar :{
        type: String,
        default: "",
    },
    createdBy: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    }
});

ConversationSchema.pre("save", function () {
    this.updatedAt = new Date();
  });

export default model<ConversationProps>("Conversation", ConversationSchema);
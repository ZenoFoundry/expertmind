import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Types, HydratedDocument } from "mongoose";

export type ChatDocument = HydratedDocument<Chat>;

export class Content {
    @Prop({ required: true, enum: ['text'], default: 'text' })
    type: string;

    @Prop({ required: true }) 
    data: string;
};

export class Message {
    @Prop({ type: String, required: true })
    id: string;

    @Prop({
        type: String,
        enum: ['user', 'assistant', 'system'],
        required: true,
        default: 'user',
    })
    role: string;

    @Prop({ type: Object, required: true })
    content: Content;

    @Prop({ type: Date, default: Date.now, required: true })
    timestamp: Date;
};

@Schema({
  timestamps: true,
  collection: 'chats',
})
export class Chat {
    _id?: Types.ObjectId;

    @Prop({ required: true, index: true })
    userId: string;

    @Prop({ required: false, maxlength: 100, trim: true })
    title: string;

    @Prop({ 
        type: String, 
        enum: ['active', 'archived', 'deleted'], 
        default: 'active',
        index: true 
    })
    status: string;

    @Prop({ type: Number, default: 0, min: 0 })
    messagesCount: number;

    @Prop({ 
        type: Array, 
        default: [], 
        validate: {
            validator: (messages) => messages.length <= 1000, message: 'Messages array cannot be empty',
        } 
    })
    messages: Message[];

    @Prop({ type: Array, default: [] })
    tags: string[];

    @Prop({ type: Date, default: Date.now })
    lastMessageAt: Date;

    createdAt?: Date;
    updatedAt?: Date;
};

export const ChatSchema = SchemaFactory.createForClass(Chat);

ChatSchema.index({ userId: 1, updatedAt: -1 });
ChatSchema.index({ userId: 1, status: 1 });
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Chat, Content } from './schemas/chat.schema';
import { v4 as uuidv4 } from 'uuid';
import { OllamaService } from 'src/ollama/ollama.service';

@Injectable()
export class ChatService {
    constructor(
        @InjectModel(Chat.name)
        private readonly chatModel: Model<Chat>,

        private readonly ollamaService: OllamaService, // Assuming OllamaService is defined and injected
    ) {}

    async createChat(userId: string, type: string, message: string, title: string): Promise<Chat> {
        const messageContent: Content = {
            type,
            data: message,
        };

        const chat = await this.chatModel.create({
            userId,
            title,
            messages: [
                {
                    id: uuidv4(),
                    timestamp: new Date(),
                    role: 'user',
                    content: messageContent
                }
            ],
        });

        const result = await this.ollamaService.generate('qwen2:1.5b', messageContent.data);

        this.addMessageToChat(chat._id?.toString() || '', type, result, 'assistant');
        
        return chat;
    }

    async addMessageToChat(chatId: string, type: string, message: string, role: string): Promise<Chat> {
        const messageContent: Content = {
            type,
            data: message,
        };

        const chat = await this.chatModel.findByIdAndUpdate(
            chatId,
            {
                $push: {
                    messages: {
                        id: uuidv4(),
                        timestamp: new Date(),
                        role,
                        content: messageContent,
                    },
                },
                $inc: { messagesCount: 1 },
            },
            { new: true }
        );

        

        if (!chat) {
            throw new Error('Chat not found');
        }

        return chat;
    }


}

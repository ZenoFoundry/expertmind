import { ApiProperty } from "@nestjs/swagger";
import { MessageContentDto } from "../create-chat.dto";

export class MessageResponseDto {
  @ApiProperty({ description: 'Message id' })
  id?: string;

  @ApiProperty({ description: 'Sender role' })
  role: string;

  @ApiProperty({ description: 'Message content' })
  content: MessageContentDto;

  @ApiProperty({ description: 'Message timestamp' })
  timestamp?: Date;

  @ApiProperty({ description: 'Message metadata', required: false })
  metadata?: object;
}

export class ChatResponseDto {
  @ApiProperty({ description: 'Indicates if the operation was successful' })
  success: boolean;

  @ApiProperty({ description: 'Chat ID' })
  chatId?: string;

  @ApiProperty({ description: 'All messages in the chat', type: [MessageResponseDto] })
  messages: MessageResponseDto[];

  @ApiProperty({ description: 'Last sent message', type: MessageResponseDto })
  lastMessage: MessageResponseDto;

  @ApiProperty({ description: 'Additional chat information' })
  chatInfo: {
    title: string;
    messageCount: number;
    createdAt?: Date;
    updatedAt?: Date;
  };
}
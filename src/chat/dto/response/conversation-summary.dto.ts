import { ApiProperty } from "@nestjs/swagger";

export class ChatSummaryDto {
  @ApiProperty({ description: 'Chat id' })
  id: string;

  @ApiProperty({ description: 'Chat title' })
  title: string;

  @ApiProperty({ description: 'NNumber of messages' })
  messageCount: number;

  @ApiProperty({ description: 'Date of the last message' })
  lastMessageAt: Date;

  @ApiProperty({ description: 'Date of creation' })
  createdAt: Date;

  @ApiProperty({ description: 'Date of last update' })
  updatedAt: Date;

  @ApiProperty({ description: 'Status of the chat' })
  status: string;
}
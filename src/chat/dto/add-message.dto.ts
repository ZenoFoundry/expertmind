import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsNotEmpty, IsString, ValidateNested } from "class-validator";
import { MessageContentDto } from "./create-chat.dto";

export class AddMessageDto {
    @ApiProperty({
        description: 'ID of the chat to which the message will be added.',
        example: '1234567890abcdef12345678',
    })
    @IsString()
    @IsNotEmpty()
    chatId: string;

    @ApiProperty({ 
        enum: ['user', 'assistant'],
        description: 'Role of the message sender, either "user" or "assistant".',
    })
    @IsString()
    @IsNotEmpty()
    role: 'user' | 'assistant';

    @ApiProperty({
        description: 'The message content to be added to the chat.',
        type: MessageContentDto,
    })
    @ValidateNested()
    @Type(() => MessageContentDto)
    content: MessageContentDto;
}
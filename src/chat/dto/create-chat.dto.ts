import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsNotEmpty, IsOptional, IsString, MaxLength, ValidateNested } from "class-validator";

export class MessageContentDto {
    @ApiProperty({
        description: 'Type of the message content, e.g., text.',
        example: 'text',
        enum: ['text'],
    })
    @IsString()
    @IsNotEmpty()
    type: string;

    @ApiProperty({
        description: 'The actual content of the message.',
        example: 'Hello, how can I help you?',
    })
    @IsString()
    @IsNotEmpty()
    data : string;
}

export class CreateChatDto {
    @ApiProperty({
        description: 'ID of the user creating the chat.',
        example: '1234567890abcdef12345678',
    })
    @IsString()
    @IsNotEmpty()
    userId: string;

    @ApiProperty({
        description: 'The initial message content for the chat.',
        type: MessageContentDto,
    })
    @ValidateNested()
    @Type(() => MessageContentDto)
    message: MessageContentDto;

    @ApiProperty({ description: 'Título personalizado para la conversación', required: false })
    @IsOptional()
    @IsString()
    @MaxLength(100)
    title?: string;
}


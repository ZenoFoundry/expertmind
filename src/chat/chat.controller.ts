import { Controller, Get, Post, Body, Param, Delete, Put, Query, UsePipes, ValidationPipe, Req, HttpException, HttpStatus } from '@nestjs/common';
import { ChatService } from './chat.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ChatResponseDto } from './dto/response/chat.dto';
import { CreateChatDto } from './dto/create-chat.dto';
import { AddMessageDto } from './dto/add-message.dto';

@ApiTags('Chat')
@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Post("/")
  @ApiOperation({
    summary: 'Create a new chat',
    description: 'Creates a new chat with the provided data.',
  })
  @ApiResponse({
    status: 201,
    description: 'Chat created successfully.',
    type: ChatResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request. Invalid chat data.',
  })
  @UsePipes(new ValidationPipe({ transform: true }))
  async createChat(
    @Body() createChatDto: CreateChatDto,
    @Req() req: Request,
  ): Promise<ChatResponseDto> {
    try {
      const chat = await this.chatService.createChat(
        createChatDto.userId,
        createChatDto.message.type,
        createChatDto.message.data,
        createChatDto.title || 'New Chat',
      );

      return {
        success: true,
        chatId: chat._id?.toString(),
        messages: chat.messages.map((msg) => ({
          id: msg.id!,
          role: msg.role,
          content: msg.content,
          timestamp: msg.timestamp!,
        })),
        lastMessage: chat.messages[chat.messages.length - 1],
        chatInfo: {
          title: chat.title,
          messageCount: chat.messages.length,
          createdAt: chat.createdAt,
          updatedAt: chat.updatedAt,
        },
      };
    } catch (error) {
      throw new HttpException(
        `Error creando conversación: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

    @Post('/:chatId/messages')
    @ApiOperation({
      summary: 'Add a message to a chat',
      description: 'Adds a new message to an existing chat chat.',
    })
    @ApiResponse({
      status: 201,
      description: 'Message added successfully.',
    })
    @ApiResponse({
      status: 404,
      description: 'Chat not found.',
    })
    @UsePipes(new ValidationPipe({ transform: true }))
    async addMessage( @Body() addMessageDto: AddMessageDto, @Req() req: Request,): Promise<ChatResponseDto> {
      try {
        const chat = await this.chatService.addMessageToChat(
          addMessageDto.chatId,
          addMessageDto.content.data,
          addMessageDto.content.type,
          addMessageDto.role || 'user',
        );

        return {
          success: true,
          chatId: chat._id!.toString(),
          messages: chat.messages.map((msg) => ({
            id: msg.id,
            role: msg.role,
            content: msg.content,
            timestamp: msg.timestamp,
          })),
          lastMessage: chat.messages[chat.messages.length - 1],
          chatInfo: {
            title: chat.title,
            messageCount: chat.messages.length,
            createdAt: chat.createdAt,
            updatedAt: chat.updatedAt,
          },
        };
      } catch (error) {
        throw new HttpException(
          `Error agregando mensaje a la conversación: ${error.message}`,
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }
}
import { Body, Controller, Inject, Post } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import {
  EVENT_STORE,
  EventStore,
  ILogger,
  IdGenerator,
  IdResponse,
  LOGGER,
  LoggingDecorator,
  UUIDGENERATOR,
} from '@app/core';
import { Auth } from 'apps/api/src/auth/infrastructure/decorators';
import { CreateAnswerCommandHandler } from '../../application/commands/create-answer';
import { CreateAnswerDto } from './dtos';

@Controller('answer')
@ApiTags('Questions')
@Auth()
export class QuestionController {
  constructor(
    @Inject(UUIDGENERATOR)
    private readonly uuidGenerator: IdGenerator<string>,
    @Inject(EVENT_STORE)
    private readonly eventStore: EventStore,
    @Inject(LOGGER)
    private readonly logger: ILogger,
  ) {}

  @Post()
  @ApiResponse({
    status: 200,
    description: 'Course started',
    type: IdResponse,
  })
  async createAnswer(
    @Body() createAnswerDto: CreateAnswerDto,
  ): Promise<IdResponse> {
    const service = new LoggingDecorator(
      new CreateAnswerCommandHandler(this.uuidGenerator, this.eventStore),
      this.logger,
      'Create Answer',
    );
    const result = await service.execute({
      content: createAnswerDto.content,
      courseId: createAnswerDto.course,
      instructor: createAnswerDto.instructor,
      question: createAnswerDto.question,
    });
    return { id: result.unwrap().id };
  }
}

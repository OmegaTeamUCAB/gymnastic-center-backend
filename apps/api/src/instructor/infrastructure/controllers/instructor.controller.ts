import {
  Body,
  Controller,
  DefaultValuePipe,
  Get,
  Inject,
  Param,
  ParseIntPipe,
  ParseUUIDPipe,
  Post,
  Query,
} from '@nestjs/common';
import { ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import {
  IdResponse,
  UUIDGENERATOR,
  IdGenerator,
  EVENT_STORE,
  EventStore,
  ILogger,
  LOGGER,
  LoggingDecorator,
  PerformanceMonitorDecorator,
  NativeTimer,
} from '@app/core';
import { Auth, CurrentUser } from 'apps/api/src/auth/infrastructure/decorators';
import { InstructorResponse } from '../responses/instructor.response';
import { CreateInstructorDto } from './dtos/create-instructor.dto';
import {
  CreateInstructorCommandHandler,
  ToggleFollowCommandHandler,
} from '../../application/commands';
import { Credentials } from 'apps/api/src/auth/application/models/credentials.model';
import { GetAllInstructorsQuery, GetInstructorByIdQuery } from '../queries';

@Controller('trainer')
@ApiTags('instructors')
@Auth()
export class InstructorController {
  constructor(
    @Inject(UUIDGENERATOR)
    private readonly uuidGenerator: IdGenerator<string>,
    @Inject(EVENT_STORE)
    private readonly eventStore: EventStore,
    @Inject(LOGGER)
    private readonly logger: ILogger,
    private readonly getAllInstructorsQuery: GetAllInstructorsQuery,
    private readonly getInstructorByIdQuery: GetInstructorByIdQuery,
  ) {}

  @Get('many')
  @ApiQuery({
    name: 'perPage',
    required: false,
    description:
      'Number of results to return for each type of search. DEFAULT = 8',
    type: Number,
  })
  @ApiQuery({
    name: 'page',
    required: false,
    description: 'Number of . DEFAULT = 1',
    type: Number,
  })
  @ApiQuery({
    name: 'filter',
    required: false,
    description: 'Instructor filtering',
    type: String,
    enum: ['FOLLOWING'],
  })
  @ApiResponse({
    status: 200,
    description: 'instructors list',
    type: [InstructorResponse],
  })
  async getInstructors(
    @CurrentUser() credentials: Credentials,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('perPage', new DefaultValuePipe(8), ParseIntPipe) perPage: number,
    @Query('filter') filter?: 'FOLLOWING',
  ): Promise<InstructorResponse[]> {
    return this.getAllInstructorsQuery.execute({
      credentials,
      filter,
      page,
      perPage,
    });
  }

  @Get('one/:id')
  @ApiResponse({
    status: 200,
    description: 'Instructor found',
    type: InstructorResponse,
  })
  @ApiResponse({
    status: 404,
    description: 'Instructor not found',
  })
  async getInstructorById(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser() credentials: Credentials,
  ): Promise<InstructorResponse> {
    return this.getInstructorByIdQuery.execute({
      id,
      credentials,
    });
  }

  @Post('toggle/follow/:id')
  @ApiResponse({
    status: 200,
    description: 'Instructor followed/unfollowed',
    type: IdResponse,
  })
  async toggleFollow(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser() credentials: Credentials,
  ) {
    const operationName = 'Toggle Follow';
    const service = new LoggingDecorator(
      new PerformanceMonitorDecorator(
        new ToggleFollowCommandHandler(this.eventStore),
        new NativeTimer(),
        this.logger,
        operationName,
      ),
      this.logger,
      operationName,
    );
    const result = await service.execute({
      instructorId: id,
      userId: credentials.userId,
    });
    return result.unwrap();
  }

  @Post()
  @ApiResponse({
    status: 200,
    description: 'Instructor created',
    type: IdResponse,
  })
  async createInstructor(@Body() createInstructorDto: CreateInstructorDto) {
    const operationName = 'Create Instructor';
    const service = new LoggingDecorator(
      new PerformanceMonitorDecorator(
        new CreateInstructorCommandHandler(this.uuidGenerator, this.eventStore),
        new NativeTimer(),
        this.logger,
        operationName,
      ),
      this.logger,
      operationName,
    );
    const result = await service.execute(createInstructorDto);
    return result.unwrap();
  }
}

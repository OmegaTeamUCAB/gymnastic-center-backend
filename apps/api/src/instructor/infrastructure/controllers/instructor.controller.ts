import {
  Body,
  Controller,
  DefaultValuePipe,
  Get,
  Inject,
  NotFoundException,
  Param,
  ParseIntPipe,
  ParseUUIDPipe,
  Post,
  Query,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Model } from 'mongoose';
import {
  IdResponse,
  UUIDGENERATOR,
  IdGenerator,
  EVENT_STORE,
  EventStore,
  MongoInstructor,
  ILogger,
  LOGGER,
  LoggingDecorator,
} from '@app/core';
import { Auth, CurrentUser } from 'apps/api/src/auth/infrastructure/decorators';
import { InstructorResponse } from '../responses/instructor.response';
import { CreateInstructorDto } from './dtos';
import { InstructorNotFoundException } from '../../application/exceptions/instructor-not-found.exception';
import {
  CreateInstructorCommandHandler,
  ToggleFollowCommandHandler,
} from '../../application/commands';
import { Credentials } from 'apps/api/src/auth/application/models/credentials.model';

@Controller('trainer')
@ApiTags('instructors')
@Auth()
export class InstructorController {
  constructor(
    @Inject(UUIDGENERATOR)
    private readonly uuidGenerator: IdGenerator<string>,
    @Inject(EVENT_STORE)
    private readonly eventStore: EventStore,
    @InjectModel(MongoInstructor.name)
    private readonly instructorModel: Model<MongoInstructor>,
    @Inject(LOGGER)
    private readonly logger: ILogger,
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
    const instructors = await this.instructorModel.find(
      {
        ...(filter === 'FOLLOWING' && { followers: credentials.userId }),
      },
      null,
      {
        skip: (page - 1) * perPage,
        limit: perPage,
      },
    );
    return instructors.map((instructor) => ({
      id: instructor.id,
      name: instructor.name,
      followers: instructor.followerCount,
      userFollow: instructor.followers.includes(credentials.userId),
      location: 'Caracas, Venezuela',
      image: instructor.image,
    }));
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
    const instructor = await this.instructorModel.findOne({
      id,
    });
    if (!instructor)
      throw new NotFoundException(new InstructorNotFoundException());
    return {
      id: instructor.id,
      name: instructor.name,
      followers: instructor.followerCount,
      userFollow: instructor.followers.includes(credentials.userId),
      location: 'Caracas, Venezuela',
      image: instructor.image,
    };
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
    const service = new LoggingDecorator(
      new ToggleFollowCommandHandler(this.eventStore),
      this.logger,
      'Toggle Follow',
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
    const service = new LoggingDecorator(
      new CreateInstructorCommandHandler(
        this.uuidGenerator,
        this.eventStore,
      ),
      this.logger,
      'Create Instructor',
    );
    const result = await service.execute(createInstructorDto);
    return result.unwrap();
  }
}

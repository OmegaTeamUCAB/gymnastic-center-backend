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
  LOCAL_EVENT_HANDLER,
  EventHandler,
  MongoInstructor,
} from '@app/core';
import { Auth, CurrentUser } from 'apps/api/src/auth/infrastructure/decorators';
import { InstructorResponse } from '../responses/instructor.response';
import { CreateInstructorDto, UpdateInstructorDto } from './dtos';
import { InstructorNotFoundException } from '../../application/exceptions/instructor-not-found';
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
    @Inject(LOCAL_EVENT_HANDLER)
    private readonly localEventHandler: EventHandler,
    @InjectModel(MongoInstructor.name)
    private readonly instructorModel: Model<MongoInstructor>,
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
  @ApiResponse({
    status: 200,
    description: 'instructors list',
    type: [InstructorResponse],
  })
  async getInstructors(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('perPage', new DefaultValuePipe(8), ParseIntPipe) perPage: number,
    @CurrentUser() credentials: Credentials,
  ): Promise<InstructorResponse[]> {
    const instructors = await this.instructorModel.find({}, null, {
      skip: (page - 1) * perPage,
      limit: perPage,
    });
    return instructors.map((instructor) => ({
      id: instructor.id,
      name: instructor.name,
      followers: instructor.followerCount,
      userFollow: instructor.followers.includes(credentials.userId),
      location: 'Caracas, Venezuela',
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
    const service = new ToggleFollowCommandHandler(
      this.eventStore,
      this.localEventHandler,
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
    const service = new CreateInstructorCommandHandler(
      this.uuidGenerator,
      this.eventStore,
      this.localEventHandler,
    );
    const result = await service.execute(createInstructorDto);
    return result.unwrap();
  }
}

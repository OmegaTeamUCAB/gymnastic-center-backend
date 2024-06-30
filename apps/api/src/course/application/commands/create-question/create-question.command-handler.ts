import { EventHandler, EventStore, IdGenerator, Result, Service } from "@app/core";
import { CreateQuestionCommand, CreateQuestionResponse } from "./types";
import { CourseNotFoundException } from "../../exceptions";
import { Course } from "../../../domain";
import { CourseId } from "../../../domain/value-objects";
import { Question } from "../../../domain/entities/questions";
import { QuestionContent, QuestionDate, QuestionId } from "../../../domain/entities/questions/value-objects";
import { UserId } from "apps/api/src/user/domain/value-objects";
import { LessonId } from "../../../domain/entities/lessons/value-objects";

export class CreateQuestionCommandHandler 
    implements Service<CreateQuestionCommand, CreateQuestionResponse>{
    constructor(
        private readonly idGenerator: IdGenerator<string>,
        private readonly eventStore: EventStore,
        private readonly eventHandler: EventHandler,
    ) {}
    async execute(command: CreateQuestionCommand): Promise<Result<CreateQuestionResponse>> {
        const events = await this.eventStore.getEventsByStream(command.courseId);
        if (events.length === 0) throw new CourseNotFoundException();
        const course = Course.loadFromHistory(new CourseId(command.courseId), events);
        course.addQuestion(
            new Question(
                new QuestionId(this.idGenerator.generateId()),
                new UserId( command.user),
                new LessonId(command.lesson),
                new QuestionContent(command.content),
                new QuestionDate(new Date()))
            );
            
        const newEvents = course.pullEvents();
        await this.eventStore.appendEvents(command.courseId, newEvents);
        this.eventHandler.publishEvents(newEvents);
        return Result.success<CreateQuestionResponse>({
            id: command.courseId,
        });
    }
}
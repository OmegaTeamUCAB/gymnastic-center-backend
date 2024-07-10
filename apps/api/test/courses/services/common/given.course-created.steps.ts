import { DomainEventFactory } from '@app/core/domain/events/domain-event';
import { Given, world } from '@cucumber/cucumber';
import { CourseCreated } from 'apps/api/src/course/domain/events';
import { EventStoreMock } from 'apps/api/test/mocks/event-store.mock';
import { IdGeneratorMock } from 'apps/api/test/mocks/id-generator.mock';

Given(
  'the instructor with id {string} created a course with a lesson with id {string}',
  (instructorId: string, lessonId: string) => {
    const eventStore = new EventStoreMock();
    const idGenerator = new IdGeneratorMock();
    const courseId = idGenerator.generateId();
    eventStore.appendEvents(idGenerator.generateId(), [
      DomainEventFactory<CourseCreated>({
        name: CourseCreated.name,
        dispatcherId: courseId,
        context: {
          name: 'course name',
          description: 'course description',
          level: 1,
          tags: ['tag'],
          weeks: 1,
          minutes: 10,
          image: 'course image',
          category: idGenerator.generateId(),
          instructor: instructorId,
          publishDate: new Date(),
          lessons: [
            {
              id: lessonId,
              title: 'lesson title',
              description: 'lesson description',
              video: 'lesson video',
            },
          ],
        },
      }),
    ]);
    world.eventStore = eventStore;
    world.courseId = courseId;
  },
);

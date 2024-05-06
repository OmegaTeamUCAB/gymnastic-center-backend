import { Gender } from '../../../../domain/entities/instructor.entity';

export type GetInstructorByIdResponse = {
  id: string;
  name: string;
  lastName: string;
  email: string;
  gender: Gender;
};

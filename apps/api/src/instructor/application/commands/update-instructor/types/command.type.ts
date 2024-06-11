export type UpdateInstructorCommand = {
  id: string;
  name?: string;
  city?: string;
  country?: string;
  followers?: number;
  userFollow?: boolean;
};

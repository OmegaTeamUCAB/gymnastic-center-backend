export type SearchCoursesResponse = {
  readonly id: string;
  readonly title: string;
  readonly description: string;
  readonly tags: string[];
  readonly imageUrl: string;
  readonly categoryName: string;
  readonly instructorName: string;
}[];

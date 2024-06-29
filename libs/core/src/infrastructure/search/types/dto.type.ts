export type SearchDto = {
  readonly searchTerm: string;
  readonly limit: number;
  readonly page?: number;
  readonly tags?: string[];
};

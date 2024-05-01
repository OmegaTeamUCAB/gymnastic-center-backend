import { Category } from '../category';

export interface CategoryRepository {
  saveCategory(category: Category): Promise<void>;
  getCategoryById(id: string): Promise<Category | null>;
  getCategories(): Promise<Category[]>;
}

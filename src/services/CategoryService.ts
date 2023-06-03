import $api from '@/http';
import { AxiosResponse } from 'axios';
import { ICategory, ICategoryList, IDeleteCategory } from '@/models/ICategory';

export default class CategoryService {
  static async getAll(): Promise<AxiosResponse<ICategory[]>> {
    return $api.get<ICategory[]>('/category/all');
  }

  static async getList(): Promise<AxiosResponse<ICategoryList[]>> {
    return $api.get<ICategoryList[]>('/category/list');
  }

  static async create(data: ICategory): Promise<AxiosResponse<ICategory>> {
    return $api.post<ICategory>('/category', data);
  }

  static async update(data: ICategory): Promise<AxiosResponse> {
    return $api.put('/category', data);
  }

  static async delete(data: IDeleteCategory): Promise<AxiosResponse> {
    return $api.delete('/category', { data });
  }
}

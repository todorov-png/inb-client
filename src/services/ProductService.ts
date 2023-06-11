import $api from '@/http';
import { AxiosResponse } from 'axios';
import { IProduct, IDeleteProduct } from '@/models/IProduct';

export default class ProductService {
  static async getAll(): Promise<AxiosResponse<IProduct[]>> {
    return $api.get<IProduct[]>('/product/all');
  }

  static async create(data: IProduct): Promise<AxiosResponse<IProduct>> {
    return $api.post<IProduct>('/product', data);
  }

  static async update(data: IProduct): Promise<AxiosResponse> {
    return $api.put('/product', data);
  }

  static async delete(data: IDeleteProduct): Promise<AxiosResponse> {
    return $api.delete('/product', { data });
  }
}

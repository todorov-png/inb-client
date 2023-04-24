import $api from '@/http';
import { AxiosResponse } from 'axios';
// import { IUser, IUpdateUser, IEditUser, IDeleteUser } from '@/models/IUser';

export default class ProductService {
  static async getProducts(): Promise<AxiosResponse<any[]>> {
    return $api.get<any[]>('/products');
  }
}

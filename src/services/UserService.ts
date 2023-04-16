import $api from '@/http';
import { AxiosResponse } from 'axios';
import { IUser, IUpdateUser } from '@/models/IUser';

export default class UserService {
  static async fetchUsers(): Promise<AxiosResponse<IUser[]>> {
    return $api.get<IUser[]>('/users');
  }

  static async sendActivationCode(): Promise<AxiosResponse> {
    return $api.post('/activation-code');
  }

  static async updateUser(data: IUpdateUser): Promise<AxiosResponse<IUser>> {
    return $api.put<IUser>('/update-user', data);
  }
}

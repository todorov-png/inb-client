import $api from '@/http';
import { AxiosResponse } from 'axios';
import { IRole } from '@/models/IRole';

export default class RoleService {
  static async fetchRoles(): Promise<AxiosResponse<IRole[]>> {
    return $api.get<IRole[]>('/roles');
  }

  static async createRole(data: IRole): Promise<AxiosResponse<IRole>> {
    return $api.post<IRole>('/role', data);
  }

  static async updateRole(data: IRole): Promise<AxiosResponse<IRole>> {
    return $api.put<IRole>('/role', data);
  }
}

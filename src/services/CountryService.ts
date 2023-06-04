import $api from '@/http';
import { AxiosResponse } from 'axios';
import { ICountry, ICountryList, IDeleteCountry } from '@/models/ICountry';

export default class CountryService {
  static async getAll(): Promise<AxiosResponse<ICountry[]>> {
    return $api.get<ICountry[]>('/country/all');
  }

  static async getList(): Promise<AxiosResponse<ICountryList[]>> {
    return $api.get<ICountryList[]>('/country/list');
  }

  static async create(data: ICountry): Promise<AxiosResponse<ICountry>> {
    return $api.post<ICountry>('/country', data);
  }

  static async update(data: ICountry): Promise<AxiosResponse> {
    return $api.put('/country', data);
  }

  static async delete(data: IDeleteCountry): Promise<AxiosResponse> {
    return $api.delete('/country', { data });
  }
}

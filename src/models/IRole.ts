import { IPermissions } from '@/models/IPermissions';

export interface IRole {
  name: string;
  permissions: IPermissions;
}

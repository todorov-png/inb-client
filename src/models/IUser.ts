export interface IUser {
  id: string;
  username: string;
  email: string;
  isActivated: boolean;
}

export interface IUpdateUser {
  username: string;
  email: string;
  password: String;
  newPassword: String;
}

export interface IEditUser {
  user: string | null;
  role: string | null;
  team: String | null;
}

export interface IDeleteUser {
  user: string;
}
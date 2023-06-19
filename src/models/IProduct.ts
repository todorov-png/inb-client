export interface IProduct {
  _id?: string;
  name: string;
  price: number;
  country: string;
  category: string;
  ageGroup: string;
}

export interface IProductUser {
  _id?: string;
  name: string;
  photo: string;
  price: number;
  country: string;
  category: string;
}

export interface IProductUserFull {
  _id: string;
  name: string;
  photo: string;
  price: number;
  country: string;
  lang: string;
  ageGroup?: string;
  callCenterSchedule?: string;
  category: string;
  currency: string;
  currencySymbol?: string;
  payout: number;
  uuid: string;
}

export interface IDeleteProduct {
  product: string;
}

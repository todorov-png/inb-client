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
  price: number;
  country: string;
  category: string;
  image: string;
}

export interface IDeleteProduct {
  product: string;
}

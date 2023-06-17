export interface IProduct {
  _id?: string;
  name: string;
  price: number;
  country: string;
  category: string;
  ageGroup: string;
}

export interface IDeleteProduct {
  product: string;
}

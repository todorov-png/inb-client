export interface IProduct {
  _id?: string;
  nameCRM: string;
  nameSoftware: string;
  price: number;
  country: string;
  category: string;
  ageGroup: string;
}

export interface IDeleteProduct {
  product: string;
}

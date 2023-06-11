export interface ICategory {
  _id?: string;
  nameEN: string;
  nameRU: string;
}

export interface ICategoryList {
  _id: string;
  nameRU: string;
}

export interface IDeleteCategory {
  category: string;
}


export interface ICategory {
  _id?: string;
  nameCRM: string;
  nameSoftware: string;
}

export interface ICategoryList {
  _id: string;
  nameSoftware: string;
}

export interface IDeleteCategory {
  category: string;
}


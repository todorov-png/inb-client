export interface ICountry {
  _id?: string;
  nameCRM: string;
  nameSoftware: string;
  currency: string;
  lang: string;
  callCenterSchedule: string;
}

export interface ICountryList {
  _id: string;
  nameSoftware: string;
}

export interface IDeleteCountry {
  country: string;
}


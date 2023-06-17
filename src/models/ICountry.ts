export interface ICountry {
  _id?: string;
  name: string;
  currency: string;
  lang: string;
  callCenterSchedule: string;
}

export interface ICountryList {
  _id: string;
  name: string;
}

export interface IDeleteCountry {
  country: string;
}


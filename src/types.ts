export type Transaction = {
  id: Number;
  value: Number;
  date: Date;
  reoccuring: Boolean;
  reoccuringFreq: Number;
  company: String;
};

export type User = {
  id: BigInt;
  first: String;
  last: String;
  email: String;
  flags: String;
  createdAt: Date;
  lastLogin: Date;
  updatedAt: Date;
  updatedBy: Number | null;
};


export interface serverResponse {
    error: boolean|null,
    errorMsg: string|null,
    data: any|null,
    callbackfunc: Function|null,

}


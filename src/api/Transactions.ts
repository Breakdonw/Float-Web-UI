import axios, { isCancel, AxiosError, AxiosResponse } from "axios";
import { getLocalJwt } from "./login";

const APISERVER = import.meta.env.VITE_API_SERVER_URL + "/Transaction";
const JWT =  getLocalJwt()
export async function getUserTransactions() {
  const getUserTransactionsUrl = `${APISERVER}/UserTransaction`;
  let jwt = getLocalJwt()
  let response = await axios.get(getUserTransactionsUrl, {
    params: {
      accessToken: JWT
    },
  });
  let totalTransactions: Map<number, simpleTransaction> = new Map();
  response.data.data.accounts.forEach((account) => {
    account.transactions.forEach((transact) => {
      totalTransactions.set(transact.id, transact);
    });
  });
  return totalTransactions;
}

export async function getUserReoccuring() {
  const getUserReoccuringUrl = `${APISERVER}/UserReoccuring`;
  let response = await axios.get(getUserReoccuringUrl, {
    params:{
        accessToken: JWT
    }
  })
  const totalReoccuring: Map<number,simpleTransaction> = new Map()
  response.data.data.accounts.forEach((account) => {
    account.transactions.forEach((transact) => {
        totalReoccuring.set(transact.id, transact);
    });
  });
  return totalReoccuring
}

export interface simpleTransaction {
  amount: Number;
  category: simpleCategory;
  company: string;
  date: Date;
  id: Number;
}

export interface simpleCategory {
  color: string;
  icon: string;
  name: string;
}

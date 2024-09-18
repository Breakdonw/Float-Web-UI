import axios, { isCancel, AxiosError, AxiosResponse } from "axios";
import { getLocalJwt } from "./login";
import Transactions from "@/components/transacations/transactions";

const APISERVER = import.meta.env.VITE_API_SERVER_URL + "/Transaction";
const JWT =  getLocalJwt()
export async function getUserTransactions() {
  const getUserTransactionsUrl = `${APISERVER}/UserTransaction`;
  let jwt = getLocalJwt()
  let response = await axios.post(getUserTransactionsUrl, {
    data: {
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

export async function getSavingsData(){
  const getSavingsDataUrl = `${APISERVER}/UserSavingsData`
  try {
    let response = await axios.post(getSavingsDataUrl,{
      data:{
        accessToken: JWT,
  
      }
    });
    const savingsAccountData: Map<number,financialAccount> = new Map()
    response.data.data.accounts.forEach((account:financialAccount)  => {
          savingsAccountData.set(account.id,account)
    });
    return savingsAccountData
  } catch (error) {
    

    console.log(error)
    return
  }
}



export async function getCreditCardData(){
  const getSavingsDataUrl = `${APISERVER}/UserCreditCard`
  try {
    let response = await axios.post(getSavingsDataUrl,{
      data:{
        accessToken: JWT,
  
      }
    });
    const creditAccount: Map<number,financialAccount> = new Map()
    response.data.data.accounts.forEach((account:financialAccount)  => {
          creditAccount.set(account.id,account)
    });
    return creditAccount
  } catch (error) {
    

    console.log(error)
    return
  }
}

export async function createUserAccount(accountNumber:string, intrest:number, maxBalance:number, type:String, provider:string, nickName:string) {
  const createUserAccountUrl = `${APISERVER}/createUserAccount`;
  try {
    let response = await axios.post(createUserAccountUrl,{
      data:{
        accessToken: JWT,
  
      }
    });
    const creditAccount: Map<number,financialAccount> = new Map()
    response.data.data.accounts.forEach((account:financialAccount)  => {
          creditAccount.set(account.id,account)
    });
    return creditAccount
  } catch (error) {
    

    console.log(error)
    return
  }

}

export async function getUserAccountData() {
  const getUserAccountsUrl = `${APISERVER}/getUserAccounts`;
  let jwt = getLocalJwt()
  let response = await axios.post(getUserAccountsUrl, {
    data: {
      accessToken: JWT
    },
    
  });
  let accounts: Map<number, financialAccount> = new Map();
  response.data.data.accounts.forEach((account) => {
    accounts.set(account.id, account)
  });
  return accounts;
}

export async function removeUserAccount(id:number){
  const getSavingsDataUrl = `${APISERVER}/removeUserAccount`
  try {
    let response = await axios.post(getSavingsDataUrl,{
      data:{
        accessToken: JWT,
        userAccountId:id,
  
      }
    });

    return response
  } catch (error) {
    

    console.log(error)
    return
  }
}

export async function updateUserAccount(id:number, financialAccount:financialAccount) {
  const updateUserAccountUrl = `${APISERVER}/updateUseraccount`
  console.log(financialAccount)
  try {
    let response = await axios.post(updateUserAccountUrl,{
      data:{
        accessToken: JWT,
        userAccountId:id,
        account: financialAccount,
  
      }
    });

    return response
  } catch (error) {
    

    console.log(error)
    return
  }
}

export enum accountType{
  checkings,
  savings,
  credit,
}

export interface financialAccount {
  id: number,
  accountNumber: number,
  provider: string,
  nickName: string,
  balance: number,
  intrest: number,
  maxBalance: number,
  type: accountType | string | number
  transactions: simpleTransaction[]
}

export enum transactionType{
  purchase,
  creditCardPayment,
  savingsDeposit,
  reoccuring,
  income
}

export interface simpleTransaction {
  amount: number;
  category: simpleCategory;
  company: string;
  date: Date;
  type: transactionType
  id: Number;
}

export interface simpleCategory {
  color: string;
  icon: string;
  name: string;
}

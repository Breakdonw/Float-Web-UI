import axios, { isCancel, AxiosError, AxiosResponse } from "axios";
import { AuthService,} from "./login";



const APISERVER = import.meta.env.VITE_API_SERVER_URL + "/Transaction";

const authService = new AuthService();
const JWT = authService.getLocalJwt()

/**
 * The function `getCategories` makes an asynchronous request to a server to retrieve categories using
 * a JWT for authentication.
 * 
 * Returns:
 *   The function `getCategories` is returning an array of `simpleCategory` objects representing the
 * categories fetched from the API endpoint `/getCategories`. If an error occurs during the API call,
 * the function will log the error and return nothing.
 */
export async function getCategories() {
  const getCategoriesUrl = `${APISERVER}/getCategories`;
  try {
    let response = await axios.post(getCategoriesUrl, {
      data: {
        accessToken: JWT,
      },
    });
    const categories: simpleCategory[] = response.data.data;
    return categories;
  } catch (error) {
    console.log(error);
    return;
  }
}

/**
 * The function `createTransaction` sends a POST request to a server to create a transaction with
 * specified details and returns the created financial account.
 * 
 * Args:
 *   amount (number): The `amount` parameter is the numerical value of the transaction amount.
 *   accountid (number): The `accountid` parameter in the `createTransaction` function represents the
 * unique identifier of the financial account to which the transaction will be associated. It is a
 * number type parameter.
 *   company (string): The `company` parameter in the `createTransaction` function represents the name
 * of the company associated with the transaction. It is a string type parameter where you would
 * provide the name of the company involved in the transaction.
 *   categoryid (number): The `categoryid` parameter in the `createTransaction` function represents the
 * category ID associated with the transaction. This could be used to categorize the transaction for
 * reporting or analysis purposes. It is a number that identifies the specific category to which the
 * transaction belongs, such as "Food", "Transportation
 *   type (string): The `type` parameter in the `createTransaction` function represents the type of
 * transaction being performed. It could be a string value indicating whether the transaction is a
 * deposit, withdrawal, transfer, or any other type of financial transaction.
 *   Frequency (number | undefined): The `Frequency` parameter in the `createTransaction` function is a
 * number or undefined. It is used to specify the frequency of the transaction, such as how often it
 * occurs (e.g., weekly, monthly, etc.). If the transaction does not have a specific frequency, the
 * value can be `
 *   date (Date): The `date` parameter in the `createTransaction` function is of type `Date` and
 * represents the date of the transaction. It is used to specify when the transaction occurred.
 * 
 * Returns:
 *   The function `createTransaction` is returning a `financialAccount` object if the transaction
 * creation is successful. If there is an error during the process, it will return `undefined`.
 */
export async function createTransaction(
  amount: number,
  accountid: number,
  company: string,
  categoryid: number,
  type: string,
  Frequency: number | undefined,
  date: Date
) {
  const createTransactionUrl = `${APISERVER}/createTransaction`;
  try {
    let response = await axios.post(createTransactionUrl, {
      data: {
        accessToken: JWT,
        transaction: {
          amount: amount,
          accountid: accountid,
          company: company,
          categoryid: categoryid,
          type: type,
          Frequency: Frequency,
          date: date,
        },
      },
    });
    const creditAccount = response.data.data;
    return creditAccount;
  } catch (error) {
    console.log(error);
    return;
  }
}

/**
 * The function `getUserRawTransactions` retrieves user transactions from a server and organizes them
 * into a map of financial accounts.
 * 
 * Returns:
 *   The `getUserRawTransactions` function returns a `Map` object containing financial accounts with
 * account IDs as keys and account details as values.
 */
export async function getUserRawTransactions() {
  const getUserTransactionsUrl = `${APISERVER}/UserTransaction`;

  let response = await axios.post(getUserTransactionsUrl, {
    data: {
      accessToken: JWT,
    },
  });
  let totalAccounts: Map<number, financialAccount> = new Map();
  response.data.data.accounts.forEach((account) => {
    totalAccounts.set(account.id, account);
  });
  return totalAccounts;
}

/**
 * This TypeScript function retrieves user transactions from an API server and organizes them into a
 * map by transaction ID.
 * 
 * Returns:
 *   The `getUserTransactions` function is returning a `Map` object containing all the transactions for
 * each account. Each transaction is stored in the map with its ID as the key and the transaction
 * object as the value.
 */
export async function getUserTransactions() {
  const getUserTransactionsUrl = `${APISERVER}/UserTransaction`;
  let response = await axios.post(getUserTransactionsUrl, {
    data: {
      accessToken: JWT,
    },
  });
  console.log(response);
  let totalTransactions: Map<number, simpleTransaction> = new Map();
  response.data.data.accounts.forEach((account) => {
    account.transactions.forEach((transact) => {
      totalTransactions.set(transact.id, transact);
    });
  });
  return totalTransactions;
}

/**
 * The function `updateTransaction` sends a POST request to update a transaction using the provided
 * financial account data.
 * 
 * Args:
 *   financialAccount (Transactions): The `financialAccount` parameter in the `updateTransaction`
 * function is expected to be an object representing a transaction. It should contain the necessary
 * information related to the transaction such as transaction amount, date, description, etc. Make sure
 * that the `Transactions` type includes all the required fields for a transaction
 * 
 * Returns:
 *   The `updateTransaction` function is returning the response from the axios POST request if the
 * request is successful. If there is an error during the request, it will log the error to the console
 * and return nothing.
 */
export async function updateTransaction(financialAccount: Transactions) {
  const updateTransactionUrl = `${APISERVER}/updateTransaction`;
  try {
    let response = await axios.post(updateTransactionUrl, {
      data: {
        accessToken: JWT,
        transaction: financialAccount,
      },
    });

    return response;
  } catch (error) {
    console.log(error);
    return;
  }
}

/**
 * This TypeScript function removes a transaction by sending a POST request to a specified API endpoint
 * with the transaction ID and access token.
 * 
 * Args:
 *   id (number): The `id` parameter in the `removeTransaction` function represents the unique
 * identifier of the transaction that needs to be removed. This identifier is used to specify which
 * transaction should be deleted from the system.
 * 
 * Returns:
 *   The `removeTransaction` function is returning the response from the API call if successful, or
 * `undefined` if there is an error.
 */
export async function removeTransaction(id: number) {
  const removeTransactionUrl = `${APISERVER}/removeTransaction`;
  try {
    let response = await axios.post(removeTransactionUrl, {
      data: {
        accessToken: JWT,
        transactionId: id,
      },
    });

    return response;
  } catch (error) {
    console.log(error);
    return;
  }
}

/**
 * The function `getUserRecurring` retrieves recurring transactions for a user from an API endpoint and
 * stores them in a map.
 * 
 * Returns:
 *   The `getUserRecurring` function is returning a `Map` object with keys of type `number` and values
 * of type `simpleTransaction`. This map contains all the recurring transactions associated with the
 * user's accounts fetched from the API endpoint `/UserRecurring`.
 */
export async function getUserRecurring() {
  const getUserRecurringUrl = `${APISERVER}/UserRecurring`;
  let response = await axios.get(getUserRecurringUrl, {
    params: {
      accessToken: JWT,
    },
  });
  const totalRecurring: Map<number, simpleTransaction> = new Map();
  response.data.data.accounts.forEach((account) => {
    account.transactions.forEach((transact) => {
      totalRecurring.set(transact.id, transact);
    });
  });
  return totalRecurring;
}

/**
 * This TypeScript function asynchronously fetches savings account data from an API server using an
 * access token and returns it as a map.
 * 
 * Returns:
 *   The `getSavingsData` function is returning a `Map` object named `savingsAccountData` that contains
 * financial account data. Each key in the `Map` is a number representing the account ID, and the
 * corresponding value is an object of type `financialAccount` containing account details. If there is
 * an error during the API call, the function will log the error and return `undefined
 */
export async function getSavingsData() {
  const getSavingsDataUrl = `${APISERVER}/UserSavingsData`;
  try {
    let response = await axios.post(getSavingsDataUrl, {
      data: {
        accessToken: JWT,
      },
    });
    const savingsAccountData: Map<number, financialAccount> = new Map();
    response.data.data.accounts.forEach((account: financialAccount) => {
      savingsAccountData.set(account.id, account);
    });
    return savingsAccountData;
  } catch (error) {
    console.log(error);
    return;
  }
}

/**
 * The function `getCreditCardData` retrieves credit card data from an API server using an access token
 * and returns it as a map of financial accounts.
 * 
 * Returns:
 *   A `Map` object containing credit card account data is being returned from the `getCreditCardData`
 * function.
 */
export async function getCreditCardData() {
  const getSavingsDataUrl = `${APISERVER}/UserCreditCard`;
  try {
    let response = await axios.post(getSavingsDataUrl, {
      data: {
        accessToken: JWT,
      },
    });
    const creditAccount: Map<number, financialAccount> = new Map();
    response.data.data.accounts.forEach((account: financialAccount) => {
      creditAccount.set(account.id, account);
    });
    return creditAccount;
  } catch (error) {
    console.log(error);
    return;
  }
}

/**
 * The function 'createUserAccount' creates a user account by sending a POST request to a specified API
 * endpoint with account details.
 * 
 * Args:
 *   accountNumber (string): The `accountNumber` parameter is a string that represents the unique
 * account number for the user's account.
 *   intrest (number): The `intrest` parameter in the `createUserAccount` function represents the
 * interest rate associated with the user's account. It is a number value that indicates the rate at
 * which interest is accrued on the account balance.
 *   maxBalance (number): The `maxBalance` parameter in the `createUserAccount` function represents the
 * maximum balance allowed for the user's account. This value specifies the upper limit for the balance
 * that can be held in the account. If the balance exceeds this maximum limit, certain actions or
 * restrictions may be applied based on the
 *   type (String): The `type` parameter in the `createUserAccount` function represents the type of the
 * user account being created. It could be a checking account, savings account, investment account, or
 * any other type of financial account. This parameter helps specify the nature of the account being
 * created.
 *   provider (string): The `provider` parameter in the `createUserAccount` function refers to the
 * financial institution or service provider associated with the user account being created. This could
 * be a bank, credit union, online payment platform, or any other financial service provider where the
 * account is being created.
 *   nickName (string): The `nickName` parameter in the `createUserAccount` function is used to specify
 * a nickname for the user account being created. This nickname can be a custom name chosen by the user
 * to easily identify the account.
 * 
 * Returns:
 *   The function `createUserAccount` is returning a `financialAccount` object.
 */
export async function createUserAccount(
  accountNumber: string,
  intrest: number,
  maxBalance: number,
  type: String,
  provider: string,
  nickName: string
) {
  const createUserAccountUrl = `${APISERVER}/createUserAccount`;
  try {
    let response = await axios.post(createUserAccountUrl, {
      data: {
        accessToken: JWT,
        account: {
          accountNumber: accountNumber,
          intrest: intrest,
          maxBalance: maxBalance,
          type: type,
          provider: provider,
          nickName: nickName,
        },
      },
    });
    const creditAccount: financialAccount = response.data.data;
    return creditAccount;
  } catch (error) {
    console.log(error);
    return;
  }
}

/**
 * The function 'getUserAccountData' asynchronously fetches user account data from an API server using a JWT
 * token and returns it as a map of financial accounts.
 * 
 * Returns:
 *   A Map containing financial account data is being returned from the `getUserAccountData` function.
 */
export async function getUserAccountData() {
  const getUserAccountsUrl = `${APISERVER}/getUserAccounts`;
  let response = await axios.post(getUserAccountsUrl, {
    data: {
      accessToken: JWT,
    },
  });
  let accounts: Map<number, financialAccount> = new Map();
  response.data.data.accounts.forEach((account) => {
    accounts.set(account.id, account);
  });
  return accounts;
}

/**
 * The function `removeUserAccount` sends a request to the server to remove a user account using the
 * provided user ID.
 * 
 * Args:
 *   id (number): The `id` parameter in the `removeUserAccount` function represents the user account ID
 * of the account that needs to be removed.
 * 
 * Returns:
 *   The `removeUserAccount` function is returning the response from the API call if successful, or
 * `undefined` if there is an error.
 */
export async function removeUserAccount(id: number) {
  const getSavingsDataUrl = `${APISERVER}/removeUserAccount`;
  try {
    let response = await axios.post(getSavingsDataUrl, {
      data: {
        accessToken: JWT,
        userAccountId: id,
      },
    });

    return response;
  } catch (error) {
    console.log(error);
    return;
  }
}

/**
 * The function `updateUserAccount` updates a user's financial account information by sending a POST
 * request to a specified API endpoint.
 * 
 * Args:
 *   id (number): The `id` parameter in the `updateUserAccount` function represents the user account ID
 * that you want to update.
 *   financialAccount (financialAccount): The `financialAccount` parameter likely represents the
 * financial account details that you want to update for a user. This could include information such as
 * account number, account type, balance, transaction history, etc.
 * 
 * Returns:
 *   The `updateUserAccount` function is returning the response from the API call if it is successful.
 * If there is an error during the API call, it will log the error to the console and return nothing.
 */
export async function updateUserAccount(
  id: number,
  financialAccount: financialAccount
) {
  const updateUserAccountUrl = `${APISERVER}/updateUseraccount`;
  try {
    let response = await axios.post(updateUserAccountUrl, {
      data: {
        accessToken: JWT,
        userAccountId: id,
        account: financialAccount,
      },
    });

    return response;
  } catch (error) {
    console.log(error);
    return;
  }
}

class Account {
  constructor(
    public id: number,
    public accountNumber: string,
    public provider: string,
    public nickName: string,
    public balance: number,
    public transactions: simpleTransaction[]
  ) {}

  getBalance(): number {
    return this.balance;
  }
}

export class CreditCardAccount extends Account {
  constructor(
    id: number,
    accountNumber: string,
    provider: string,
    nickName: string,
    balance: number,
    transactions: simpleTransaction[],
    public interestRate: number,
    public maxBalance: number
  ) {
    super(id, accountNumber, provider, nickName, balance, transactions);
  }

  calculateInterest(): number {
    return this.balance * (this.interestRate / 100);
  }
}

export class SavingsAccount extends Account {
  constructor(
    id: number,
    accountNumber: string,
    provider: string,
    nickName: string,
    balance: number,
    transactions: simpleTransaction[],
    public interestRate: number,
    public goalBalance: number
  ) {
    super(id, accountNumber, provider, nickName, balance, transactions);
  }

  calculateGoalProgress(): number {
    return (this.balance / this.goalBalance) * 100;
  }
}

export enum accountType {
  checkings,
  savings,
  credit,
}

export interface financialAccount {
  id: number;
  accountNumber: number;
  provider: string;
  nickName: string;
  balance: number;
  intrest: number;
  maxBalance: number;
  type: accountType | string | number;
  transactions: simpleTransaction[];
}

export enum transactionType {
  purchase = "purchase",
  creditCardPayment = "creditCardPayment",
  savingsDeposit = "savingsDeposit",
  recurring = "recurring",
  income = "income",
}

export interface simpleTransaction {
  amount: number;
  frequency: number;
  category: simpleCategory;
  company: string;
  date: Date;
  type: transactionType;
  id: Number;
}

export interface simpleCategory {
  id: number;
  color: string;
  icon: string;
  name: string;
}

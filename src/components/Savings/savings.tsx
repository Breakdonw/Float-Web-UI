import { useState, useEffect } from "react";
import { Linechart } from "../charts/linechart/linechart";
import { accountType, financialAccount, simpleTransaction, transactionType } from "@/api/Transactions";
import dayJs from  'dayjs'
import { Skeleton } from "../ui/skeleton";


export function transformSavingsData(accounts: financialAccount[]) {
  let savingsAccounts = []

  accounts.forEach(account => {
    if (account) {
      const balanceLine = {
        id: `${account.nickName} - Actual`,
        color: 'hsl(59, 100.00%, 68.60%)',
        data: calculateTransactionBalances(account)
      }
      const futureProjection = calculateFutureProjection(account)
      const goalLine = createGoalLine(account);


      savingsAccounts.push({
        id: account.nickName,
        data: [
          balanceLine,
          futureProjection,
          goalLine]
      })

    }



  })




  return savingsAccounts
}

const createGoalLine = (account: financialAccount) => {
  const lastTransactionDate = account.transactions[account.transactions.length - 1]?.date;
  const monthsToGoal = 12; // Example: Reach goal in 1 year

  const goalLineData = [];

  for (let i = 0; i <= monthsToGoal; i++) {
    const nextDate = new Date(lastTransactionDate);
    nextDate.setMonth(nextDate.getMonth() + i);

    goalLineData.push({
      x: dayJs(nextDate).format('YYYY-MM-DD'),
      y: account.maxBalance
    });
  }

  return {
    id: `${account.nickName} - Goal Line`,
    color: 'hsl(88, 75.40%, 55.30%)',
    data: goalLineData
  };
};


const balanceAfterTransaction = (currentBalance: number, transaction: simpleTransaction): number => {
  switch (transaction.type) {
    case transactionType.purchase:
    case transactionType.creditCardPayment:
      return currentBalance - transaction.amount;
    case transactionType.savingsDeposit:
    case transactionType.income:
      return currentBalance + transaction.amount;
    default:
      return currentBalance;
  }
};

const averageMonthlyDeposit = (transactions: simpleTransaction[]): number => {
  const depositTransactions = transactions.filter(transaction => String(transaction.type) ===  "savingsDeposit" || String(transaction.type) === "income");
  const totalDeposits = depositTransactions.reduce((acc, transaction) => acc + transaction.amount, 0);
  const uniqueMonths = new Set(depositTransactions.map(transaction => dayJs(transaction.date).get('month')));

  return uniqueMonths.size > 0 ? totalDeposits / uniqueMonths.size : 0;
};

const calculateFutureProjection = (account: financialAccount) => {
  const transactions = account.transactions;
  const lastTransactionDate = transactions[transactions.length - 1]?.date;
  const currentBalance = transactions.length > 0
    ? transactions.reduce((balance, transaction) => balanceAfterTransaction(balance, transaction), 0)
    : account.balance;

  // Simple projection over 12 months
  const futureData = [];
  const monthsToProject = 12; // Example: 1 year projection
  const monthlyDeposit = averageMonthlyDeposit(transactions);

  for (let i = 1; i <= monthsToProject; i++) {
    const nextDate = new Date(lastTransactionDate);
    nextDate.setMonth(nextDate.getMonth() + i);

    futureData.push({
      x: dayJs(nextDate).format('YYYY-MM-DD'),
      y: currentBalance + (monthlyDeposit * i) 
    });
  }

  return {
    id: `${account.nickName} - Future Projection`,
    color: 'hsl(209, 72.60%, 45.90%)',
    data: futureData
  };
};

const calculateTransactionBalances = (account: financialAccount) => {
  let runningBalance = 0; // Initial balance before transactions
  const balanceData = [];

  if(account.transactions.length < 1){
    return [{x:dayJs(new Date).format('YYYY-MM-DD'),y:0}, ]
  }
  account.transactions.forEach(transaction => {
    // Update running balance based on transaction type
    switch (transaction.type as string) {
      case "purchase":
        runningBalance -= Number(transaction.amount);
        break;
      case "creditCardPayment":
        runningBalance -= Number(transaction.amount);
        break;
      case "savingsDeposit":
        runningBalance += Number(transaction.amount);
        break;
      case "income":
        runningBalance += Number(transaction.amount);
        break;
      case "recurring":
        runningBalance += Number(transaction.amount);
        break;
      default:
        console.warn("Could not decipher Transaction type in CalculateTransactionBalnces FUnction")
        break;
    }

    balanceData.push({
      x: dayJs(transaction.date).format('YYYY-MM-DD'),
      y: runningBalance
    });
  });

  return balanceData;
};

export default function Savings({ spenddata }) {
  const [showExtraSavingsdata, setshowExtraSavingsdata] = useState(true)
  const [savingsData, setSavingsData] = useState([])
  const [currentSelected, setCurrentSelected] = useState(0)

  function viewNextAccount(){
    if (currentSelected >= spenddata.accounts.size){
        setCurrentSelected(0)
    } else {setCurrentSelected(currentSelected+1)}
  }

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 2000 && !showExtraSavingsdata) {
        setshowExtraSavingsdata(true);
      } else if (window.innerWidth <= 2000 && showExtraSavingsdata) {
        setshowExtraSavingsdata(false);
      }
    };

    // Call handleResize on component mount to set initial state
    handleResize();
    setSavingsData(transformSavingsData(spenddata))
    // Listen for resize events and update state accordingly
    window.addEventListener("resize", handleResize);
    // Clean up event listener on component unmount
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [showExtraSavingsdata]);
  return (
    < >
      {savingsData.length > 0 && savingsData[currentSelected].data[0].length > 0 ? <>
       {/* tedst {savingsData[2].id} */}
       <Linechart spendData={savingsData[currentSelected].data} /> 
        </>
        : <> <Skeleton className="w-[120%] m-5" />  </> }
      {showExtraSavingsdata && (
        <div className="">
          <span><b>Savings Goal</b>: $14,000</span>
          <span><b>Eta to Goal</b>: 5/8/2028</span>
          <span><b>Current Bal</b>: $6,000</span>
          <span><b>Monthly Contribution</b>: $200</span>
          <span><b>Interest Rate</b>: 4.25%</span>
        </div>
      )}
    </>
  )
}
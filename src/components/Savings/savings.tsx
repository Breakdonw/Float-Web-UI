import { useState, useEffect } from "react";
import { Linechart } from "../charts/linechart/linechart";
import { accountType, financialAccount, simpleTransaction, transactionType, SavingsAccount} from "@/api/Transactions";
import dayJs from 'dayjs'
import { Skeleton } from "../ui/skeleton";
import { number } from "zod";


export function transformSavingsData(data: SavingsAccount[]) {
  let savingsAccounts = []
  let accounts = []
  data.forEach(act=>{
    accounts.push(new SavingsAccount(act.id,act.accountNumber,act.provider,act.nickName,act.balance,act.transactions,act.intrest,act.maxBalance))
  })
  console.log(accounts)
  
  accounts.forEach(account => {
    if (account && account.goalBalance && account.interestRate) {
      const balanceLine = {
        goal:account.goalBalance,
        name:account.nickName,
        curBal:account.balance,
        intrest:account.interestRate,
        id: `${account.nickName} - Actual`,
        color: 'hsl(59, 100.00%, 68.60%)',
        data: calculateTransactionBalances(account)
      }
      const futureProjection = calculateFutureProjection(account)
      const goalLine = createGoalLine(account);

      if(balanceLine.data.length >= 1){
        
      savingsAccounts.push({
        id: account.nickName,
        data: [
          balanceLine,
          futureProjection,
          goalLine]
      })

    }

      }


  })



  return savingsAccounts
}

const createGoalLine = (account: SavingsAccount) => {
  // Fallback to current date if there are no transactions
  const lastTransactionDate = account.transactions.length > 0
    ? account.transactions[account.transactions.length - 1].date
    : new Date(); // Use current date if no transactions are available

  const monthsToGoal = 12; //  Reach goal in 1 year

  const goalLineData = [];

  for (let i = 0; i <= monthsToGoal; i++) {
    // Use dayJs to ensure date is valid
    const nextDate = dayJs(lastTransactionDate).add(i, 'month').toDate(); // Add months correctly

    // Check if nextDate is valid
    if (!isNaN(nextDate.getTime())) {
      goalLineData.push({
        x: dayJs(nextDate).format('YYYY-MM-DD'),
        y: account.goalBalance * (i / 12)
      });
    } else {
      console.warn(`Invalid date generated: ${nextDate}`);
    }
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
  const depositTransactions = transactions.filter(transaction => String(transaction.type) === "savingsDeposit" || String(transaction.type) === "income");
  const totalDeposits = depositTransactions.reduce((acc, transaction) => acc + transaction.amount, 0);
  const uniqueMonths = new Set(depositTransactions.map(transaction => dayJs(transaction.date).get('month')));

  return uniqueMonths.size > 0 ? totalDeposits / uniqueMonths.size : 0;
};

const calculateFutureProjection = (account: SavingsAccount) => {
  const transactions = account.transactions;
  const lastTransactionDate = transactions.length > 0 
    ? transactions[transactions.length - 1].date 
    : new Date(); // Fallback to current date if no transactions
  const currentBalance = transactions.length > 0
    ? transactions.reduce((balance, transaction) => balanceAfterTransaction(balance, transaction), 0)
    : account.balance;

  // Simple projection over 12 months
  const futureData = [];
  const monthsToProject = 12; // Example: 1 year projection
  const monthlyDeposit = averageMonthlyDeposit(transactions) || 0; // Fallback to 0 if no deposits

  for (let i = 1; i <= monthsToProject; i++) {
    const nextDate = new Date(lastTransactionDate);
    nextDate.setMonth(nextDate.getMonth() + i);

    futureData.push({
      x: dayJs(nextDate).format('YYYY-MM-DD'),
      y: currentBalance + (monthlyDeposit * i) // Project balance based on monthly deposits
    });
  }

  return {
    id: `${account.nickName} - Future Projection`,
    color: 'hsl(209, 72.60%, 45.90%)',
    data: futureData
  };
};

const calculateTransactionBalances = (account: SavingsAccount) => {
  let runningBalance = 0; // Initial balance before transactions
  const balanceData = [];

  if (account.transactions.length < 1) {
    return [{ x: dayJs(new Date).format('YYYY-MM-DD'), y: 0 },]
  }
  account.transactions.forEach(transaction => {
    // Update running balance based on transaction type
    switch (transaction.type) {
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

  function viewNextAccount() {
    if (currentSelected >= savingsData.length - 1) {
      setCurrentSelected(0)
    } else { setCurrentSelected(currentSelected + 1) }
  }

  function viewPrevAccount() {
    if (currentSelected == 0) {
      setCurrentSelected(savingsData.length -1)
    } else { setCurrentSelected(currentSelected - 1) }    
  }
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 1800 && !showExtraSavingsdata) {
        setshowExtraSavingsdata(true);
      } else if (window.innerWidth <= 1800 && showExtraSavingsdata) {
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

      <div className="flex flex-row h-full w-full">

        {savingsData.length > 0 && savingsData[currentSelected].data.length > 0 ? <>
          <Linechart spendData={savingsData[currentSelected].data} />
        </>
          : <> <Skeleton className="w-[100%] m-5" />  </>}
        {showExtraSavingsdata && savingsData && savingsData.length >0 ?  (
          <div className="flex mt-10  flex-col">
            <span><b>Savings Goal</b>: ${savingsData? savingsData[currentSelected].data[0].goal : '0'  }</span>
            <span><b>Current Bal</b>: ${savingsData? savingsData[currentSelected].data[0].curBal : '0'  }</span>
            <span><b>Interest Rate</b>: {savingsData? savingsData[currentSelected].data[0].intrest : '0'  }%</span>
          </div>
        ) :null}
      </div>
      <div className="mt-auto flex-row">
          <button onClick={viewPrevAccount}>prev</button>
          <span> | { savingsData && savingsData.length >0  ? savingsData[currentSelected].data[0].name : 'Account'} |</span>
          <button onClick={viewNextAccount}>next</button>
      </div>
    </>
  )
}
import { createFileRoute, Navigate, redirect, useNavigate, useRouter } from '@tanstack/react-router'
import '../App.css'
import Footer from '../components/footer/footer'
import MonthlySpendingChart from '@/components/charts/pie/monthlySpending'
import Recurring from '../components/recurringpurchases/recurring'
import Savings from '@/components/Savings/savings'
import CreditCardPayoff from '@/components/creditcard/creditcard'
import Transactions from '@/components/transacations/transactions'
import { AuthService } from '@/api/login'
import { getSavingsData, getUserRecurring, getUserTransactions, getCreditCardData, simpleTransaction, getCategories, getUserRawTransactions, simpleCategory } from '@/api/Transactions'
import { useEffect, useMemo, useState } from 'react'
import { toast } from '@/hooks/use-toast'
import * as Dialog from '@radix-ui/react-dialog';
import AccountGrid from '@/components/grids/accountgrid'
import TransactionGrid from '@/components/grids/transactiongrid'
import { Skeleton } from '@/components/ui/skeleton'

const authService = new AuthService() 

export const Route = createFileRoute('/dashboard')({
  component: Dashboard,
  beforeLoad: async ({ location }) => {
    if (await authService.verifyJwt() === false) {
      toast({
        title: "Error",
        variant: "destructive",
        description: "Bad JWT",
      })
      throw redirect({
        to: '/',
        search: {
          redirect: location.href
        }
      })
    }
  }
})

function LogoutButton() {
  const router = useRouter();

  function handleSignout(e) {
    e.preventDefault();
    authService.clearJwt(); // Assuming you clear any JWT or session info here
    router.navigate({ to: '/' }); // Adjust path if needed
  }

  return (
    <button className='btn bg-red-600 w-full' onClick={handleSignout}>
      Sign Out
    </button>
  );
}


async function fetchCategories(specificVal: string | null): Promise<Map<number, simpleCategory> | undefined> {
  const fetchedCategories = await getCategories(); // Assuming getCategories returns a list of categories

  switch (specificVal) {
    case 'n':
      let n = []
      fetchedCategories.forEach(c => {
        n.push(c.name)
      });
      return n
      break;

    case 'm':
      let m: Map<number, simpleCategory> = new Map()
      fetchedCategories?.forEach(c => {
        m.set(c.id, c)
      })

      return m as Map<number, simpleCategory>;

    default:
      break;
  }
  return undefined
}


export function exportTransactionsToCSV(transactionsMap: Map<number, simpleTransaction>, filename: string = 'transactions.csv') {
  // Step 1: Define the CSV headers
  const headers = ['ID', 'Amount', 'Company', 'Type', 'Frequency', 'Category ID', 'Category Name', 'Date'].join(',') + '\n';

  // Step 2: Map the transactions from the Map object into CSV format (row by row)
  const csvRows = Array.from(transactionsMap.values()).map(transaction => {
      const { id, amount, company, type, frequency, category, date } = transaction;
      return [
          id,
          amount,
          company,
          type,
          frequency || '', // Handle missing Frequency values
          category.id,      // Accessing category ID
          category.name,    // Accessing category name
          new Date(date).toLocaleDateString('en-US')  // Format date as needed
      ].join(',');
  });

  // Step 3: Combine headers and rows into a single CSV string
  const csvContent = headers + csvRows.join('\n');

  // Step 4: Create a Blob from the CSV string
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });

  // Step 5: Create a link to download the Blob
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
  link.setAttribute('download', filename);

  // Step 6: Append the link to the body and trigger the download
  document.body.appendChild(link);
  link.click();

  // Step 7: Cleanup the link after download
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}



function Dashboard() {
  async function handleExportClick() {
    try {
        const transactions = await getUserTransactions(); // This returns a Map of transactions
        exportTransactionsToCSV(transactions); // Pass the transactions Map to the export function
    } catch (error) {
        console.error('Error fetching transactions:', error);
    }
}


  const [transactionData, setTransactionData] = useState(new Map)
  const [recurringData, setRecurringData] = useState(new Map)
  const [savingsData, setSavingsData] = useState(new Map())
  const [creditCardData, setCreditCardData] = useState(new Map())
  const [categories, setCategories] = useState(new Map())
  const [userAccounts, setUserAcccounts] = useState(new Map())

  useEffect(() => {

    fetchData();
  }, [])

  const fetchData = async () => {
    setTransactionData(await getUserTransactions())
    setRecurringData(await getUserRecurring())
    setSavingsData(await getSavingsData())
    setCreditCardData(await getCreditCardData())
    setCategories(await fetchCategories('m'))
    setUserAcccounts(await getUserRawTransactions())
  }

  return (
    <>
      <div className='w-[100vw] h-[100vh] flex flex-col justify-between items-center  bg-slate-900'>
        <header></header>
        <div className='w-full h-full columns-2 p-10 pb-0'>
          <div className='w-full h-full bg-slate-700 rounded-xl'>
            <div className='flex flex-row justify-center items-center  w-full h-full ' >
              {transactionData && transactionData.size ? <MonthlySpendingChart spendData={transactionData} info={"test string"} /> :
                <>
                  <Skeleton className='w-[35%] h-[75%] rounded-full' />
                  <div className='ml-4 h-full w-[60%] pt-24 space-y-6'>
                    <Skeleton className='w-[100%] h-[10%] rounded-full' />
                    <Skeleton className='w-[100%] h-[10%] rounded-full' />
                    <Skeleton className='w-[100%] h-[10%] rounded-full' />
                    <Skeleton className='w-[100%] h-[10%] rounded-full' />
                  </div>
                </>
              }
            </div>
            <h2>Monthly Spend </h2>
          </div>
          <div className='w-full h-full bg-slate-700 rounded-xl flex flex-row overflow-x-hidden '>

            {recurringData && recurringData.size > 0 ? <Recurring reoccuringPurchases={recurringData} /> :
              <>
                <Skeleton className='w-[35%] h-[75%] rounded-full mt-10' />
                <div className='ml-4 h-full w-[60%] pt-24 space-y-6'>
                  <Skeleton className='w-[100%] h-[10%] rounded-full' />
                  <Skeleton className='w-[100%] h-[10%] rounded-full' />
                  <Skeleton className='w-[100%] h-[10%] rounded-full' />
                  <Skeleton className='w-[100%] h-[10%] rounded-full' />
                </div>
              </>

            }
          </div>
              <h2>Recurring</h2>
        </div>
        <div className=' w-full h-full columns-3 p-10 '>
          <div className='flex flex-col  h-full bg-slate-700  rounded-xl '>
            {savingsData && savingsData.size > 0 ? <Savings spenddata={savingsData} /> :
              <>
                <Skeleton className='w-[35%] h-[55%] rounded-full mt-20 ml-4' />
                <div className='mx-4 h-full w-[60%] pt-24 space-y-6'>
                  <Skeleton className='w-[100%] h-[10%] rounded-full' />
                  <Skeleton className='w-[100%] h-[10%] rounded-full' />
                  <Skeleton className='w-[100%] h-[10%] rounded-full' />
                  <Skeleton className='w-[100%] h-[10%] rounded-full' />
                </div>
              </>
            }
          </div>
          <h2>Savings Goal</h2>
          
          <div className='flex flex-col  h-full bg-slate-700 rounded-xl'>
            {creditCardData && creditCardData.size > 0 ? <CreditCardPayoff spendData={creditCardData} /> :
              <>
              <Skeleton className='w-[35%] h-[55%] rounded-full mt-20 ml-4' />
              <div className='mx-4 h-full w-[60%] pt-24 space-y-6'>
                <Skeleton className='w-[100%] h-[10%] rounded-full' />
                <Skeleton className='w-[100%] h-[10%] rounded-full' />
                <Skeleton className='w-[100%] h-[10%] rounded-full' />
                <Skeleton className='w-[100%] h-[10%] rounded-full' />
              </div>
            </>
            }
          </div>
          <h2> Credit Card</h2>

          <div className='flex flex-col h-full   bg-slate-700  rounded-xl'>
            <span className='row my-5'> <h1>Welcome!</h1></span>
            <hr className='row w-full ' />
            <div className='px-5 pt-3 justify-between space-y-1'>
              <Dialog.Root>
                <Dialog.Trigger asChild>
                  <button className="btn bg-blue-600 w-full">
                    Add/View Transactions
                  </button>
                </Dialog.Trigger>
                <Dialog.Portal>
                  <Dialog.Overlay className="bg-black bg-opacity-55 data-[state=open]:animate-overlayShow fixed inset-0" />
                  <Dialog.Content className="data-[state=open]:animate-contentShow fixed top-[30%] left-[50%] max-h-[85vh] w-[90vw] sm:max-w-[450px] md:max-w-[1000px] lg:max-w-[1500px]  translate-x-[-50%] translate-y-[-50%] rounded-[6px] bg-slate-800 p-[25px] shadow-[hsl(206_22%_7%_/_35%)_0px_10px_38px_-10px,_hsl(206_22%_7%_/_20%)_0px_10px_20px_-15px] focus:outline-none">
                    <Dialog.Title className="text-mauve12 m-0 text-[17px] font-medium">
                      Add/View Transactions

                    </Dialog.Title>
                    <Dialog.Description className="text-mauve11 mt-[10px] mb-5 text-[15px] grid  leading-normal">
                      View / Add / Remove Bank Transactions
                    </Dialog.Description>
                    <TransactionGrid categories={categories} accounts={userAccounts} />
                    <Dialog.Close asChild>
                      <button className="bg-green4 mt-4 text-green11 hover:bg-green5 focus:shadow-green7 inline-flex h-[35px] items-center justify-center rounded-[4px] px-[15px] font-medium leading-none focus:shadow-[0_0_0_2px] focus:outline-none">
                        Exit
                      </button>
                    </Dialog.Close>
                    <Dialog.Close asChild>
                      <button
                        className="text-violet11 hover:bg-violet4 focus:shadow-violet7 absolute top-[10px] right-[10px] inline-flex h-[25px] w-[25px] appearance-none items-center justify-center rounded-full focus:shadow-[0_0_0_2px] focus:outline-none"
                        aria-label="Close"
                      >
                      </button>
                    </Dialog.Close>
                  </Dialog.Content>
                </Dialog.Portal>
              </Dialog.Root>

              {/*  Add / view accounts VVV Add/view Transactions ^^^^^  */}

              <Dialog.Root>
                <Dialog.Trigger asChild>
                  <button className="btn bg-blue-600 w-full">
                    Add/View Accounts
                  </button>
                </Dialog.Trigger>
                <Dialog.Portal>
                  <Dialog.Overlay className="bg-black bg-opacity-55 data-[state=open]:animate-overlayShow fixed inset-0" />
                  <Dialog.Content className="data-[state=open]:animate-contentShow fixed top-[30%] left-[50%] max-h-[85vh] w-[90vw] sm:max-w-[450px] md:max-w-[1000px] lg:max-w-[1500px]  translate-x-[-50%] translate-y-[-50%] rounded-[6px] bg-slate-800 p-[25px] shadow-[hsl(206_22%_7%_/_35%)_0px_10px_38px_-10px,_hsl(206_22%_7%_/_20%)_0px_10px_20px_-15px] focus:outline-none">
                    <Dialog.Title className="text-mauve12 m-0 text-[17px] font-medium">
                      Add/View Accounts

                    </Dialog.Title>
                    <Dialog.Description className="text-mauve11 mt-[10px] mb-5 text-[15px] grid  leading-normal">
                      View / Add / Remove Bank accounts
                    </Dialog.Description>
                    <AccountGrid />
                    <Dialog.Close asChild>
                      <button className="bg-green4 mt-4 text-green11 hover:bg-green5 focus:shadow-green7 inline-flex h-[35px] items-center justify-center rounded-[4px] px-[15px] font-medium leading-none focus:shadow-[0_0_0_2px] focus:outline-none">
                        Exit
                      </button>
                    </Dialog.Close>
                    <Dialog.Close asChild>
                      <button
                        className="text-violet11 hover:bg-violet4 focus:shadow-violet7 absolute top-[10px] right-[10px] inline-flex h-[25px] w-[25px] appearance-none items-center justify-center rounded-full focus:shadow-[0_0_0_2px] focus:outline-none"
                        aria-label="Close"
                      >
                      </button>
                    </Dialog.Close>
                  </Dialog.Content>
                </Dialog.Portal>
              </Dialog.Root>
              <button onClick={handleExportClick} className='btn w-full bg-blue-600'>
                Export to CSV
              </button>
              
              <LogoutButton/>


            </div>
          </div>
        </div>
        <Footer />
      </div>

    </>
  )
}
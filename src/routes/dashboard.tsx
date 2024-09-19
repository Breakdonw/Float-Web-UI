import { createFileRoute, Navigate, redirect, useNavigate, useRouter } from '@tanstack/react-router'
import '../App.css'
import Footer from '../components/footer/footer'
import MonthlySpendingChart from '@/components/charts/pie/monthlySpending'
import Recurring from '../components/recurringpurchases/recurring'
import Savings from '@/components/Savings/savings'
import CreditCardPayoff from '@/components/creditcard/creditcard'
import Transactions from '@/components/transacations/transactions'
import { clearJwt, verifyJwt } from '@/api/login'
import { getSavingsData, getUserRecurring, getUserTransactions, getCreditCardData, removeUserAccount, getUserAccountData, getCategories, getUserRawTransactions } from '@/api/Transactions'
import { useEffect, useMemo, useState } from 'react'
import { toast } from '@/hooks/use-toast'
import * as Dialog from '@radix-ui/react-dialog';
import AccountGrid, { createAccount } from '@/components/grids/accountgrid'
import TransactionGrid from '@/components/grids/transactiongrid'

export const Route = createFileRoute('/dashboard')({
  component: Dashboard,
  beforeLoad: async ({ location }) => {
    if (await verifyJwt() === false) {
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

export function Signout(e) {
  const router = useRouter()
  e.preventDefault()
  clearJwt()
  router.invalidate();
}


async function fetchCategories(specificVal:string | null):Promise<Map<number,simpleCategory>| undefined> {
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
      let m:Map<number,simpleCategory> = new Map()  
    fetchedCategories?.forEach(c=>{
        m.set(c.id,c)
      })

    return m as Map<number,simpleCategory>;
  
    default:
      break;
  }
  return undefined
}


function Dashboard() {



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
              {transactionData && transactionData.size ? <MonthlySpendingChart spendData={transactionData} info={"test string"} /> : null}
            </div>
          </div>
          <div className='w-full h-full bg-slate-700 rounded-xl flex flex-row overflow-x-hidden '>

            {recurringData && recurringData.size > 0 ? <Recurring recurringPurchases={recurringData} /> : null}

          </div>
        </div>
        <div className=' w-full h-full columns-3 p-10 '>
          <div className='flex flex-row  h-full bg-slate-700  rounded-xl '>
            {savingsData && savingsData.size > 0 ? <Savings spenddata={savingsData} /> : null}
          </div>
          <div className='flex flex-row  h-full bg-slate-700 rounded-xl'>
            {creditCardData && creditCardData.size > 0 ? <CreditCardPayoff spendData={creditCardData} /> : null}
          </div>
          <div className='flex flex-col h-full   bg-slate-700  rounded-xl'>
            <span className='row my-5'> <h1>Welcome user!</h1></span>
            <hr className='row w-full ' />
            <div className='p-5 justify-between space-y-5'>
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
              <button onClick={Signout} className='btn bg-red-600 w-full'> Signout    </button>


            </div>
          </div>
        </div>
        <Footer />
      </div>

    </>
  )
}
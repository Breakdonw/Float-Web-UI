import { createFileRoute, redirect } from '@tanstack/react-router'
import '../App.css'
import Footer from '../components/footer/footer'
import MonthlySpendingChart from '@/components/charts/pie/monthlySpending'
import Reoccuring from '../components/reoccuring purchases/reoccuring'
import Savings from '@/components/Savings/savings'
import CreditCardPayoff from '@/components/creditcard/creditcard'
import Transactions from '@/components/transacations/transactions'
import { verifyJwt } from '@/api/login'
import { getSavingsData, getUserReoccuring, getUserTransactions, getCreditCardData } from '@/api/Transactions'
import { useEffect, useMemo, useState } from 'react'
import { toast } from '@/hooks/use-toast'

export const Route = createFileRoute('/dashboard')({
  component: Dashboard,
  beforeLoad: async ({location}) =>{
    if(await verifyJwt() === false ){
      toast({
        title: "Error",
        variant: "destructive",
        description: "Bad JWT",
    })
      throw redirect({
        to:'/',
        search:{
          redirect: location.href
        }
      })
    }
  }
})





function Dashboard() {


  
  const [transactionData, setTransactionData] = useState(new Map )
  const [reoccuringData, setReoccuringData] = useState(new Map)
  const [savingsData, setSavingsData] = useState(new Map())
  const [creditCardData, setCreditCardData] = useState(new Map())
  useEffect(()=>{

    fetchData();
  },[])

  const fetchData = async () => {
      setTransactionData(await getUserTransactions())
      setReoccuringData(await getUserReoccuring())
      setSavingsData(await getSavingsData())
      setCreditCardData(await getCreditCardData())

  }

  return (
    <>
      <div className='w-[100vw] h-[100vh] flex flex-col justify-between items-center  bg-slate-900'>
        <header></header>
        <div className='w-full h-full columns-2 p-10 pb-0'>
          <div className='w-full h-full bg-slate-700 rounded-xl'>
            <div className='flex flex-row justify-center items-center  w-full h-full ' >
              {transactionData && transactionData.size? <MonthlySpendingChart spendData={transactionData} info={"test string"} /> : null}
            </div>
          </div>
          <div className='w-full h-full bg-slate-700 rounded-xl flex flex-row overflow-x-hidden '>
              
              {reoccuringData && reoccuringData.size > 0 ? <Reoccuring  reoccuringPurchases={reoccuringData} /> :  null  }

          </div>
        </div>
        <div className=' w-full h-full columns-3 p-10 '>
          <div className='flex flex-row  h-full bg-slate-700  rounded-xl '>
            {savingsData && savingsData.size > 0 ? <Savings spenddata={savingsData} /> : null}
          </div>
          <div className='flex flex-row  h-full bg-slate-700 rounded-xl'>
           {creditCardData && creditCardData.size > 0 ?  <CreditCardPayoff spendData={creditCardData} info={"test string"}/>: null}
          </div>
          <div className='flex h-full bg-slate-700  rounded-xl'> 
            {/* <Transactions spendData={transaction} /> */}
             </div>
        </div>
        <Footer />
      </div>

    </>
  )
}
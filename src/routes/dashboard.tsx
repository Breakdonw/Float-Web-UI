import { createFileRoute, redirect } from '@tanstack/react-router'
import '../App.css'
import Footer from '../components/footer/footer'
import MonthlySpendingChart from '@/components/charts/pie/monthlySpending'
import Reoccuring from '../components/reoccuring purchases/reoccuring'
import Savings from '@/components/Savings/savings'
import CreditCardPayoff from '@/components/creditcard/creditcard'
import Transactions from '@/components/transacations/transactions'
import { verifyJwt } from '@/api/login'

export const Route = createFileRoute('/dashboard')({
  component: Dashboard,
  beforeLoad: async ({location}) =>{
    if(!verifyJwt()){
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
  let fakedata = [
    {
      "id": "1",
      "label": "ruby",
      "value": 112,
      "color": "hsl(292, 70%, 50%)"
    },
    {
      "id": "2",
      "label": "css",
      "value": 558,
      "color": "hsl(264, 70%, 50%)"
    },
    {
      "id": "3",
      "label": "javascript",
      "value": 195,
      "color": "hsl(200, 70%, 50%)"
    },
    {
      "id": "4",
      "label": "haskell",
      "value": 586,
      "color": "hsl(320, 70%, 50%)"
    },
    {
      "id": "5",
      "label": "sass",
      "value": 509,
      "color": "hsl(226, 70%, 50%)"
    }
  ]


  const transaction = [
    {
      id: 1,
      value: "$200",
      date: "2024-08-01",
      reoccuring: true,
      reoccuringFrequency: "Monthly",
      company: "TechCorp",
      remove: false
    },
    {
      id: 2,
      value: "$150",
      date: "2024-08-15",
      reoccuring: false,
      reoccuringFrequency: "None",
      company: "InnoVate",
      remove: false
    },
    {
      id: 3,
      value: "$300",
      date: "2024-09-10",
      reoccuring: true,
      reoccuringFrequency: "Quarterly",
      company: "GreenEnergy",
      remove: true
    },
    {
      id: 4,
      value: "$500",
      date: "2024-10-05",
      reoccuring: true,
      reoccuringFrequency: "Annually",
      company: "FutureSolutions",
      remove: false
    },
    {
      id: 5,
      value: "$100",
      date: "2024-07-22",
      reoccuring: false,
      reoccuringFrequency: "None",
      company: "FastFix",
      remove: true
    }
  ];
  
  return (
    <>
      <div className='w-[100vw] h-[100vh] flex flex-col justify-between items-center  bg-slate-900'>
        <header></header>
        <div className='w-full h-full columns-2 p-10 pb-0'>
          <div className='w-full h-full bg-slate-700 rounded-xl'>
            <div className='flex flex-row justify-center items-center  w-full h-full ' >
              <MonthlySpendingChart spendData={fakedata} info={"test string"} />
            </div>
          </div>
          <div className='w-full h-full bg-slate-700 rounded-xl'>
            <div className='flex flex-row items-center justify-center h-full w-full'>
              <Reoccuring />
            </div>
          </div>
        </div>
        <div className=' w-full h-full columns-3 p-10 '>
          <div className='flex flex-row  h-full bg-slate-700  rounded-xl '>
            <div className='w-full'><Savings /></div>
          </div>
          <div className='flex flex-row  h-full bg-slate-700 rounded-xl'>
            <CreditCardPayoff spendData={fakedata} info={"test string"}/>
          </div>
          <div className='flex h-full bg-slate-700  rounded-xl'> <Transactions spendData={transaction} /> </div>
        </div>
        <Footer />
      </div>

    </>
  )
}
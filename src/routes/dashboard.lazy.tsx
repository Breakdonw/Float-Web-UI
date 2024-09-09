import { createLazyFileRoute } from '@tanstack/react-router'
import '../App.css'
import Footer from '../components/footer/footer'
import MonthlySpendingChart from '@/components/charts/pie/piechart'
import Reoccuring from '../components/reoccuring purchases/reoccuring'



export const Route = createLazyFileRoute('/dashboard')({
  component: Dashboard
})


function Dashboard() {
  let fakedata = [
    {
      "id": "ruby",
      "label": "ruby",
      "value": 112,
      "color": "hsl(292, 70%, 50%)"
    },
    {
      "id": "css",
      "label": "css",
      "value": 558,
      "color": "hsl(264, 70%, 50%)"
    },
    {
      "id": "javascript",
      "label": "javascript",
      "value": 195,
      "color": "hsl(200, 70%, 50%)"
    },
    {
      "id": "haskell",
      "label": "haskell",
      "value": 586,
      "color": "hsl(320, 70%, 50%)"
    },
    {
      "id": "sass",
      "label": "sass",
      "value": 509,
      "color": "hsl(226, 70%, 50%)"
    }
  ]
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
        <div className=' w-full h-full columns-3 p-10'>
          <div className='flex h-full bg-slate-700  rounded-xl '>
      

          </div>
          <div className='flex  h-full bg-slate-700 rounded-xl'> 4</div>
          <div className='flex h-full bg-slate-700  rounded-xl'> 5</div>
        </div>
        <Footer />
      </div>

    </>
  )
}
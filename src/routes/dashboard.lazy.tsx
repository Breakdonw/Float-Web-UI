import { createLazyFileRoute } from '@tanstack/react-router'
import '../App.css'
import Footer from '../components/footer/footer'

export const Route = createLazyFileRoute('/dashboard')({
  component: Dashboard
})


function Dashboard() {

  return (
    <>
        <div className='w-[100vw] h-[100vh] flex flex-col justify-between items-center  bg-slate-900'>
          <header></header>
            <div className='w-full h-full columns-2 px-8'>
                  <div className='w-full h-full bg-slate-700 rounded-xl'>1 </div>
                  <div className='w-full h-full bg-slate-700 rounded-xl'> 2</div>
            </div>
            <div className=' w-full h-full columns-3 p-8'>
                  <div className='flex h-full bg-slate-700  rounded-xl '> 3</div>
                  <div className='flex  h-full bg-slate-700 rounded-xl'> 4</div>
                  <div className='flex h-full bg-slate-700  rounded-xl'> 5</div>
            </div>
            <Footer/>
        </div>

    </>
  )
}
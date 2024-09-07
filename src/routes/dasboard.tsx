import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/dasboard')({
  component: () => Dashboard,
})


function Dashboard() {

  return (
    <>
        <div className='w-screen h-screen flex bg-slate-900'>

        </div>

    </>
  )
}
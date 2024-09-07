import { createLazyFileRoute } from '@tanstack/react-router'
import '../App.css'
import svg from '../assets/react.svg'
import Footer from '../components/footer/footer'

export const Route = createLazyFileRoute('/')({
    component: Index,
})

function Index() {
    return (
        <div className='h-[100vh] w-[100vw]  flex justify-center items-center   bg-slate-900 '>
            <div className='flex flex-col justify-between h-screen w-screen items-center    '>
                <div className='container  flex justify-center items-center'>
                    <img className='logo ' src={svg} alt="" />
                    <h1>Float</h1>
                </div>
                <div className=' mb-auto w-1/4  my-5 p-6'>
                    <div className='h-full rounded-lg bg-slate-700'>
                        <div className="p-6  space-y-4 md:space-y-6 sm:p-8">
                            <h1 className="text-xl font-bold leading-tight tracking-tight text-slate-50 md:text-2xl dark:text-white">
                                Sign in to your account

                            </h1>
                            <hr className='max-w-64- items-center justify-center' />
                            <form className="space-y-4 md:space-y-6" action="#">
                                <div>
                                    <input type="email" name="email" id="email" className="bg-slate-800 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="name@company.com" />
                                </div>
                                <div>
                                    <input type="password" name="password" id="password" placeholder="••••••••" className="bg-slate-800 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" />
                                </div>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-start">
                                        <div className="flex items-center h-5">
                                            <input id="remember" aria-describedby="remember" type="checkbox" className="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-primary-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-primary-600 dark:ring-offset-gray-800" />
                                        </div>
                                        <div className="ml-3 text-sm">
                                            <label className="text-gray-400 dark:text-gray-300">Remember me</label>
                                        </div>
                                    </div>
                                    <a href="#" className="text-sm font-medium text-primary-600 hover:underline dark:text-primary-500">Forgot password?</a>
                                </div>
                                <button type="submit" className="w-full text-white bg-slate-800 hover:bg-slate-600 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800">Sign in</button>
                                <p className="text-sm font-light text-gray-400 dark:text-gray-200">
                                    Don’t have an account yet? <a href="#" className="font-medium text-primary-600 hover:underline dark:text-primary-500">Sign up</a>
                                </p>
                            </form>
                        </div>

                    </div>
                    <div className='container h-10  bg-slate-900'> "<i>A financial planning solution</i>" </div>
                </div>

                <Footer />
            </div>
        </div>
    )
}

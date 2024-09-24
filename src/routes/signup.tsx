import  { useRouter, createFileRoute, redirect, useNavigate } from '@tanstack/react-router'
import svg from '@/assets/sailboat.webp'
import Footer from '@/components/footer/footer'
import '@/App.css'
import { Link } from '@tanstack/react-router'
import { AuthService } from '@/api/login'
import { toast } from '@/hooks/use-toast'
import { useState } from 'react'
export const Route = createFileRoute('/signup')({
  component: Signup,
})

const authservice = new AuthService();


export default function Signup() {
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState(false)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [errorMsg, setErrorMsg] = useState(new Map())
  const router = useRouter()


  const checkPassword = () => {
    let errors = new Map();
    if (password == '') {
      setError(true)
      errors.set('empty', 'Please enter a password')
      return false
    } else {
      errors.delete('empty')
    }
    if (password !== confirmPassword) {
      setError(true)
      errors.set('match', 'Passwords do not match')
      return false
    } else {
      errors.delete('match')
    }
    if (password.length < 8) {
      setError(true)
      errors.set('length', 'Password must be at least 8 characters')
      return false
    } else { errors.delete('length') }
    const numCheck = /(?=.*[0-9])/;
    if (numCheck.test(password) === false) {
      setError(true)
      errors.set('numeric', 'Password must contain at least one number')
      return false
    } else { errors.delete('numeric') }
    const specialCharCheck = /(?=.*[!@#$%^&*])/;
    if (specialCharCheck.test(password) === false) {
      setError(true)
      errors.set('specialChar', 'Password must contain at least one special character')
      return false
    } else { errors.delete('specialChar') }

    setErrorMsg(errors)

  }

  const checkNames = () => {
    let errors = errorMsg;
    if (firstName === '' || lastName === '') {
      setError(true)
      errors.set('emptyName', 'Please enter a first and last name')
    } else { errors.delete('empty') }
    if (firstName.length < 2 || lastName.length < 2) {
      setError(true)
      errors.set('lengthName', 'First and last name must be at least 2 characters')
      return false
    } else { errors.delete('length') }

    setErrorMsg(errors)
  }




  const checkEmail = () => {
    let errors = errorMsg;
    if (email === '') {
      setError(true)
      errors.set('emptyEmail', 'Please enter an email')
    } else { errors.delete('emptyEmail') }
    const emailCheck = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
    if (emailCheck.test(email) === false) {
      setError(true)
      errors.set('invalidEmail', 'Please enter a valid email')
    } else { errors.delete('invalidEmail') }
    setErrorMsg(errors)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(false)
    checkNames()
    checkPassword()
    checkEmail()
    if (error === true) { return; }
    authservice.register(firstName, lastName, email, password).then( async (res) => {
      if (await res.error == true) {
        toast({
          variant: "destructive",
          title: "Uh oh! Something went wrong.",
          description: "There was a problem with your request.",
        })
        setError(true)
      } else {
       router.navigate({to:'/dashboard'})
      }
    })
  }


  return (
    <>
      <div className='h-[100vh] w-[100vw]  flex justify-center items-center   bg-slate-900 '>
        <div className='flex flex-col justify-between h-screen w-screen items-center    '>
          <div className='container  flex justify-center items-center'>
            <img className='logo  rounded-full' src={svg} alt="" />
            <h1>Float</h1>
          </div>
          <div className=' mb-auto w-1/4  my-5 p-6'>
            <div className='h-full rounded-lg bg-slate-700'>
              <div className="p-6  space-y-4 md:space-y-6 sm:p-8">
                <h1 className="text-xl font-bold leading-tight tracking-tight text-slate-50 md:text-2xl dark:text-white">
                  Sign up for an account

                </h1>
                <hr className='max-w-64- items-center justify-center' />
                <ul>
                  {errorMsg.forEach((msg, key, any) => {
                    return (
                      <li key={key} className='text-red-500'>{msg}</li>)
                  }                  )}

                </ul>

                <form className="space-y-4 md:space-y-6" onSubmit={handleSubmit}>
                  <div>
                    <input type="text" name="firstName" value={firstName} onChange={(e) => {
                      setFirstName(e.target.value)
                      e.preventDefault()
                    }}
                      id="firstName" className="bg-slate-800 border border-gray-300 text-white  rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="First Name" />
                  </div>
                  <div>
                    <input type="text" value={lastName} onChange={(e) => {
                      setLastName(e.target.value)
                      e.preventDefault()
                    }}
                      name="lastName" id="lastName" className="bg-slate-800 border border-gray-300rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Last Name" />
                  </div>
                  <div>
                    <input type="email" value={email} onChange={(e) => {
                      setEmail(e.target.value)
                      e.preventDefault()
                    }} name="email" id="email" className="bg-slate-800 border border-gray-300 text-white rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Email " />
                  </div>
                  <div>
                    <input type="password" value={password} onChange={(e) => {
                      setPassword(e.target.value)
                      e.preventDefault()
                    }} name="password" id="password" placeholder="Password" className="bg-slate-800 border border-gray-300  text-white  rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" />
                  </div>
                  <div>
                    <input type="password" value={confirmPassword} onChange={(e) => {
                      setConfirmPassword(e.target.value)
                      e.preventDefault()
                    }} name="verifyPassword" id="verifyPassword" placeholder="Verify Password" className="bg-slate-800 border border-gray-300  text-white  rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" />
                  </div>

                  <button type="submit" className="w-full text-white bg-slate-800 hover:bg-slate-600 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800">Sign up</button>
                  <p className="text-sm font-light text-gray-400 dark:text-gray-200">
                    Already have an account? <Link to='/' className="font-medium text-primary-600 hover:underline dark:text-primary-500">Sign in</Link>
                  </p>
                </form>
              </div>

            </div>
            <div className='container h-10 pt-6 italic bg-slate-900'> "<i>A financial planning solution</i>" </div>
          </div>

          <Footer />
        </div>
      </div>
    </>
  )
}
import { useState } from "react"
import Button from "../../components/Button"
// import Input from "../../components/Input"
import InputSignIn from "../../components/Input/InputSignIn"
import { useNavigate } from 'react-router-dom'

const Form = ({ isSignInPage = false }) => {
  const [data, setData] = useState(() => ({
    ...(isSignInPage ? {} : { username: '' }),
    email: '',
    password: ''
  }))

  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const res = await fetch(`http://localhost:8000/api/${isSignInPage ? 'login' : 'register'}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      })
      if (res.status === 400) {
        alert('Invalid credentials')
        return
      }
      
      const resData = await res.json();
      if(isSignInPage){
        if (resData?.token) {
          localStorage.setItem('user:token', resData.token)
          localStorage.setItem('user:user', JSON.stringify(resData.user))
          navigate('/')
        } else {
          alert('Unexpected error occurred')
        }
      }
      else{
        alert('User reistered!');
        navigate('/')
      }
    } catch (error) {
      console.error('Error:', error)
      alert('An error occurred. Please try again.')
    }
  }

  return (
    <div className="bg-light h-screen flex items-center justify-center">
      <div className="bg-white w-[500px] h-[600px] shadow-lg rounded-lg flex flex-col justify-center items-center">
        <div className="text-4xl font-extrabold">
          WELCOME {isSignInPage && 'Back'}
        </div>
        <div className="text-1xl font-light mb-14">
          {isSignInPage ? 'Sign in to get explored' : 'Sign up now to get started'}
        </div>

        <form className="flex flex-col items-center w-full" onSubmit={handleSubmit}>
          {!isSignInPage && (
            <InputSignIn
              label="Full name"
              name="name"
              placeholder="Enter your full name"
              className="mb-6 w-[200px]"
              value={data.username}
              onChange={(e) => setData({ ...data, username: e.target.value })}
            />
          )}
          <InputSignIn
            label="Email address"
            type="email"
            name="Email"
            placeholder="Enter your Email"
            className="mb-6 w-[200px]"
            value={data.email}
            onChange={(e) => setData({ ...data, email: e.target.value })}
          />
          <InputSignIn
            label="Password"
            type="password"
            name="Password"
            placeholder="Enter your Password"
            className="mb-6 w-[200px]"
            value={data.password}
            onChange={(e) => setData({ ...data, password: e.target.value })}
          />
          <Button label={isSignInPage ? "Sign in" : "Sign up"} type="submit" className="mb-2 w-36 text-lg" />
        </form>

        <div>
          {isSignInPage ? "Didn't have an account" : "Already have an account ?"}{" "}
          <span className="text-primary cursor-pointer underline" onClick={() => navigate(`/user/${isSignInPage ? 'sign_up' : 'sign_in'}`)}>
            {isSignInPage ? 'Sign up' : 'Sign in'}
          </span>
        </div>
      </div>
    </div>
  )
}

export default Form

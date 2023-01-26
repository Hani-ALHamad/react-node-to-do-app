import React, { useContext } from 'react'
import { AppContext } from './context'
import Loading from './loading'

// the login page
const Login = () => {
  const { 
    formUsername,
    changeFormUsername,
    formPassword,
    changeFormPassword,
    submitSigninForm,
    loading,
    errorMessage
  } = useContext(AppContext)

  return(
    <div className='login_main'>
      <div className='login_title'>
        To Do App
      </div>
      <div className='login_sign_in'>Sign in</div>
      <form className='login_form' onSubmit={submitSigninForm}>
        <input 
          autoComplete='false' 
          className='login_input' 
          placeholder='Username' 
          value={formUsername} 
          onChange={e => changeFormUsername(e.target.value)}
        />
        <input 
          type="password" 
          className='login_input' 
          placeholder='Password'
          value={formPassword}
          onChange={e => changeFormPassword(e.target.value)}
        />
        
        {loading ? 
          <Loading />
          :
          <input type="submit" className='login_submit' value="Log in" />
        }

        {errorMessage !== "" ?
          <div className='login_sign_in' style={{color: "red"}}>{errorMessage}</div>
        :
          <></>
        }
      </form>
      <div className='login_sign_in'>Don't have an account?</div>
      <div className='login_sign_in'>Sign up a new account on my <a target="_blank" rel='noreferrer' href="https://hani-user-system.up.railway.app/signup">User System app</a></div>
      <a
        className="my_github"
        href="https://github.com/Hani-ALHamad"
        target="_blank"
        rel="noreferrer">
        My GitHub
      </a>

    </div>
  )
}

export default Login

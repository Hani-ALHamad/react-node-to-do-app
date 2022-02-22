import React, { useContext } from 'react'
import Add from './addTask';
import './index.css'
import Login from './login';
import Nav from './nav';
import Tasks from './tasks';
import Loading from './loading'
import { AppContext } from "./context";


function App() {
  const { isLoggedIn, isChecked } = useContext(AppContext)

  if(!isChecked) {
    return (
      <div className='main'>
        <div className='main_loading'>
          <Loading />
        </div>
      </div>
    )
  }

  if(!isLoggedIn){
    return (
      <div className='main'>
        <Login />
      </div>
    )
  }

  return (
    <div className="main">
      <Tasks />
      <Nav />
      <Add />
    </div>
  );
}

export default App;

import React, { useContext } from 'react'
import { BsSun, BsMoon, BsList } from 'react-icons/bs'
import { AppContext } from './context'

const Nav = () => {
  const { 
    handleLogOut, 
    userData, 
    darkMode, 
    changeDarkMode, 
    navPriorityFunction, 
    navTimeFunction, 
    navSearch, 
    changeNavSearch, 
    navMobileListFunction} = useContext(AppContext)

  return (
    <div className='nav_main'>
        <div className='nav_title'>To Do App</div>
      <button className='nav_show_hide' onClick={navMobileListFunction}><BsList /></button>
      <div className='nav_priority_box nav_priority_box_mobile'>
        <button 
          className='nav_priority nav_priority_mobile priority_low' 
          name="priority_low" 
          onClick={e => navPriorityFunction(e)}>Low</button>
        <button 
          className='nav_priority nav_priority_mobile priority_medium' 
          name="priority_medium" 
          onClick={e => navPriorityFunction(e)}>Medium</button>
        <button 
          className='nav_priority nav_priority_mobile priority_high' 
          name="priority_high" 
          onClick={e => navPriorityFunction(e)}>High</button>
      </div>
      <div className='nav_time_box'>
        <button 
          className='nav_time nav_time_mobile nav_time_selected' 
          name="all" 
          onClick={e => navTimeFunction(e)}>All</button>
        <button 
          className='nav_time nav_time_mobile' 
          name="today" 
          onClick={e => navTimeFunction(e)}>Today</button>
        <button 
          className='nav_time nav_time_mobile' 
          name="late" 
          onClick={e => navTimeFunction(e)}>Late</button>
        <button 
          className='nav_time nav_time_mobile' 
          name="complete" 
          onClick={e => navTimeFunction(e)}>Complete</button>
      </div>
      <input 
        className='login_input nav_input' 
        placeholder='Search 🔍' 
        value={navSearch} 
        onChange={e => changeNavSearch(e.target.value.trim())}/>
      {darkMode === "dark" ?
        <button className='login_submit nav_light_dark' onClick={() => changeDarkMode("light")}>Light <BsSun /></button>
      :
        <button className='login_submit nav_light_dark' onClick={() => changeDarkMode("dark")}>Dark <BsMoon /></button>
      }
      <a 
        href='https://hani-user-system.herokuapp.com/account' 
        target="_blank"
        rel="noreferrer"
        className='nav_avatar_container'
        title={userData.username}
      >
        {!userData.avatar ?
          <div>No Avatar</div>
        :
          <img className="nav_avatar" src={`data:image/jpg;base64,${userData.avatar}`} alt="Avatar" />
        }
      </a>
      <a
        href='https://hani-user-system.herokuapp.com/account'
        target="_blank"
        rel="noreferrer"
        className='nav_username'
      >{userData.username}</a>
      <button className='login_submit nav_sign_out' onClick={handleLogOut}>Sign Out</button>
    </div>
  )
}

export default Nav
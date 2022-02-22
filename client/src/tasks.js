import React, { useContext } from 'react'
import { AppContext } from './context'
import Task from './singleTask'

// tasks container
const Tasks = () => {
  const { tasksList, noTasks, navTime, handleDeleteAll} = useContext(AppContext)

  if(tasksList.length === 0){
    return (
      <div className='tasks_main'>
        <div className='tasks_not_found'>{noTasks}</div>
      </div>
    )
  }

  return (
    <div className='tasks_main'>
      {navTime === "complete" ?
        <button 
          className='login_submit nav_sign_out nav_delete_all' 
          onClick={handleDeleteAll}>Delete all completed
        </button>
        :
        <></>
      }
      {tasksList.map((task) => (
        <Task task={task}/>
      ))}
    </div>
  )
}

export default Tasks
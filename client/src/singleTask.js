import React, { useContext, useEffect } from 'react'
import { BiTrash } from 'react-icons/bi'
import { AppContext } from './context'

const Task = ({task}) => {
  const { 
    handleCheckboxChange,
    tasksList, 
    editingIndex, 
    changeEditingIndex,
    changeSingleTaskPriority,
    changeSingleTaskTime,
    singleTaskDate,
    changeSingleTaskDate,
    singleTaskText,
    changeSingleTaskText,
    handleDelete,
    handleSave,
    navPriority,
    navTime,
    navSearch
  } = useContext(AppContext)
  const index = tasksList.indexOf(task)

  
  // to check if the task got a date or not, then give it a class to show the date and choose color
  var taskClass = "add_date_text"
  if(task.date !== ""){
    const currentDate = new Date()
    const taskDate = new Date(task.date)
    if (currentDate.getTime() > taskDate.getTime() + 86400000 ){
      taskClass = "add_date_text add_date_text_late"
    }
  }

  // when switching a task to the editing mode, it does take its current values and store them in states
  const handleTaskIsEditing = () => {
    changeSingleTaskPriority(task.priority)
    changeSingleTaskDate(task.date)
    changeSingleTaskTime(task.time)
    changeSingleTaskText(task.text)

    changeEditingIndex(index)
  }

  // when cancelling editing, clears all the changes to these states
  const handleEditingCancel = () => {
    changeSingleTaskPriority("")
    changeSingleTaskDate("")
    changeSingleTaskTime("")
    changeSingleTaskText("")
    changeEditingIndex(null)
  }



  // to choose which buttons will show as "selected"
  useEffect(() => {
    if (document.getElementsByName(task._id)[0]){
      if(task.priority[0] === "priority_low"){
        document.getElementsByName(task._id)[0].classList.add("nav_priority_selected")
      } else if (task.priority[0] === "priority_medium"){
        document.getElementsByName(task._id)[1].classList.add("nav_priority_selected")
      } else {
        document.getElementsByName(task._id)[2].classList.add("nav_priority_selected")
      }

      if(task.time === "priority_date"){
        document.getElementsByName(task._id)[3].classList.add("nav_priority_selected")
      } else if (task.time === "priority_day"){
        document.getElementsByName(task._id)[4].classList.add("nav_priority_selected")
      } else {
        document.getElementsByName(task._id)[5].classList.add("nav_priority_selected")
      }
      document.documentElement.style.setProperty('--priority-dynamic-clr-editing', task.priority[1])
    }
  },[editingIndex, task])

  // when changing priority in editing
  const handlePriorityChange = (e, priority) => {
    document.getElementsByName(task._id)[0].classList.remove("nav_priority_selected")
    document.getElementsByName(task._id)[1].classList.remove("nav_priority_selected")
    document.getElementsByName(task._id)[2].classList.remove("nav_priority_selected")
    e.target.classList.add("nav_priority_selected")
    document.documentElement.style.setProperty('--priority-dynamic-clr-editing', priority[1])
    changeSingleTaskPriority(priority)
  }

  // when changing time in editing
  const handleTimeChange = (e, time) => {
    document.getElementsByName(task._id)[3].classList.remove("nav_priority_selected")
    document.getElementsByName(task._id)[4].classList.remove("nav_priority_selected")
    document.getElementsByName(task._id)[5].classList.remove("nav_priority_selected")
    e.target.classList.add("nav_priority_selected")
    changeSingleTaskTime(time)
  }


  // to determin which tasks should be displayed, each task will be checked
  if (task.date !== "") {
    const currentDate = new Date()
    const taskDate = new Date(task.date)
    var allowNavTime = false
    if ((Math.abs(currentDate.getTime() - taskDate.getTime()) < 86400000) && navTime === "today" && task.time === "priority_day") {
      allowNavTime = true
    } else if ((currentDate.getTime() > taskDate.getTime() + 86400000) && navTime === "late" && (task.time === "priority_day" || task.time === "priority_date")){
      allowNavTime = true
    }
  }
  if (((navPriority === task.priority[0] || navPriority === "any") && (allowNavTime || navTime === "all") && !task.completed && task.text.includes(navSearch)) || (navTime === "complete" && task.completed && task.text.includes(navSearch))){
    return (
      <div className='task_main'>
        <div className='add_buttons_container task_buttons_container'>
          {/* editing */}
          {editingIndex !== index
            ?
            <>
              <button className='login_submit task_edit_button' onClick={() => handleTaskIsEditing(task)}>Edit</button>
              <div className='add_date_text'>Created At: {task.createdAt.substring(0, 10)}</div>
              <div className={taskClass}>
                {task.time === "priority_day" && task.date !== "" ? `Specific Day: ${task.date}`
                  :
                  task.time === "priority_date" && task.date !== "" ? `By date: ${task.date}`
                    :
                    ""
                }
              </div>
            </>
            :
            <>
            {/* not editing */}
              <div className='add_buttons_container_row'>
                <div className='nav_priority_box'>
                  <button 
                    className='nav_priority add_priority priority_low' 
                    name={task._id} 
                    id="" 
                    onClick={e => handlePriorityChange(e, ["priority_low", "#35db24"])}>Low</button>
                  <button 
                    className='nav_priority add_priority priority_medium' 
                    name={task._id} 
                    id="" 
                    onClick={e => handlePriorityChange(e, ['priority_medium', '#ffd02a'])}>Medium</button>
                  <button 
                    className='nav_priority add_priority priority_high' 
                    name={task._id} 
                    id="" 
                    onClick={e => handlePriorityChange(e, ['priority_high', '#ff2a2c'])}>High</button>
                </div>
                <div className='nav_priority_box'>
                  <button 
                    className='nav_priority add_priority add_priority_time' 
                    name={task._id} 
                    onClick={e => handleTimeChange(e, "priority_date")}>By date</button>
                  <button 
                    className='nav_priority add_priority add_priority_time' 
                    name={task._id} 
                    onClick={e => handleTimeChange(e, "priority_day")}>Specific day</button>
                  <button 
                    className='nav_priority add_priority add_priority_time' 
                    name={task._id} 
                    onClick={e => handleTimeChange(e, "priority_none")}>No time</button>
                </div>
              </div>
              <input 
                type="date" 
                className='add_date task_date' 
                value={singleTaskDate} 
                onChange={e => changeSingleTaskDate(e.target.value)} />
              <div className='task_save_buttons_container'>
                <button 
                  className='login_submit task_button task_button_trash' 
                  onClick={() => handleDelete(task)}><BiTrash /></button>
                <button 
                  className='login_submit task_button' 
                  onClick={handleEditingCancel}>Cancel</button>
                <button 
                  className='login_submit task_button' 
                  onClick={() => handleSave(task)}>Save</button>
              </div>
            </>
          }
        </div>
        {editingIndex !== index ?
          <div className='task_text_container'>{task.text}</div>
          :
          <textarea 
            placeholder='Your changes to the task' 
            value={singleTaskText} 
            onChange={e => changeSingleTaskText(e.target.value)} 
            className="task_text_container task_text_container_textarea" />
        }

        <div className='task_check_container' style={{ backgroundColor: `${task.priority[1]}` }}>
          <input 
            className='task_checkbox' 
            type="checkbox" 
            value={task.completed} 
            checked={task.completed} 
            onChange={() => handleCheckboxChange(task)} />
        </div>
      </div>
    )
  }


  return (
    <></>
  )
}

export default Task
import React, { useContext } from 'react'
import { AppContext } from './context'

const Add = () => {
  const { 
    addPriorityFunction, 
    addTimeFunction, 
    addDate, 
    changeAddDate, 
    addText, 
    changeAddText,
    handleFormSubmit,
    operationMessage
  } = useContext(AppContext)

  // new task form
  return (
    <form className='add_main' onSubmit={e => handleFormSubmit(e)}>
      <div className='add_save_message' style={{ backgroundColor:operationMessage[1]}}>{operationMessage[0]}</div>
      <div className='add_buttons_container add_only'>
        <div className='add_buttons_container_row'>
        <div className='nav_priority_box'>
            <button 
              className='nav_priority add_priority priority_low nav_priority_selected' 
              id="priority_low" 
              onClick={e => addPriorityFunction(e, "#35db24")}
            >Low</button>
            <button 
              className='nav_priority add_priority priority_medium' 
              id="priority_medium" 
              onClick={e => addPriorityFunction(e, "#ffd02a")}
            >Medium</button>
            <button 
              className='nav_priority add_priority priority_high' 
              id="priority_high" 
              onClick={e => addPriorityFunction(e, "#ff2a2c")}
            >High</button>
        </div>
        <div className='nav_priority_box'>
            <button 
              className='nav_priority add_priority add_priority_time' 
              id="priority_date" 
              onClick={e => addTimeFunction(e)}
            >By date</button>
            <button 
              className='nav_priority add_priority add_priority_time' 
              id="priority_day" 
              onClick={e => addTimeFunction(e)}
            >Specific day</button>
            <button 
              className='nav_priority add_priority add_priority_time nav_priority_selected' 
              id="priority_none" 
              onClick={e => addTimeFunction(e)}
            >No time</button>
        </div>
        </div>
        <input 
          value={addDate} 
          onChange={e => changeAddDate(e.target.value)} 
          type="date" 
          className='add_date'
        />
      </div>

      <textarea 
        value={addText} 
        onChange={e => changeAddText(e.target.value)} 
        className='add_textarea login_input' 
        placeholder="Add a new task here" 
        maxLength="1000"
        required
      /> 
      <input type="submit" className='add_send login_submit' value="Save"/>
    </form>
  )
}

export default Add
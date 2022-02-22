import React, {createContext, useState, useEffect} from "react";

export const AppContext = createContext()

const Context = ({children}) => {
  const [isLoggedIn, changeIsLoggedIn] = useState(false)
  const [isChecked, changeIsChecked] = useState(false)
  const [formUsername, changeFormUsername] = useState("")
  const [formPassword, changeFormPassword] = useState("")
  const [userData, changeUserData] = useState({ username: "" })
  const [loading, changeLoading] = useState(false)
  const [errorMessage, changeErrorMessage] = useState("")
  const [darkMode, changeDarkMode] = useState("")
  const [addPriority, changeAddPriority] = useState(["priority_low", "#35db24"])
  const [addTime, changeAddTime] = useState("priority_none")
  const [addDate, changeAddDate] = useState("")
  const [addText, changeAddText] = useState("")
  const [navPriority, changeNavPriority] = useState("any")
  const [navTime, changeNavTime] = useState("all")
  const [navSearch, changeNavSearch] = useState("")
  const [navMobileList, changeNavMobileList] = useState(false)
  const [operationMessage, changeOperationMessage] = useState(["", "#35db24"])
  const [tasksList, changeTasksList] = useState([])
  const [noTasks, changeNoTasks] = useState("")
  const [tasksIsLoading, changeTasksIsLoading] = useState(false)
  const [editingIndex, changeEditingIndex] = useState("")
  const [singleTaskPriority, changeSingleTaskPriority] = useState("")
  const [singleTaskTime, changeSingleTaskTime] = useState("")
  const [singleTaskDate, changeSingleTaskDate] = useState("")
  const [singleTaskText, changeSingleTaskText] = useState("")
  
  // ! for login/logout part, i nearly used the same code from my User System App.
  // a function to check if the user is logged in or not, will get called multiple times below
  const loginCheck = async () => {
    const response = await fetch(`/logincheck`)
    const jsoned = await response.json()
    if (response.ok) {
      changeIsLoggedIn(true)
      changeIsChecked(true)
      changeUserData({
        username: jsoned.username,
        avatar: jsoned.avatar
      })
    } else {
      changeIsLoggedIn(false)
      changeIsChecked(true)
    }
  }

  // calling loginCheck whenever you switch back to the tab again
  useEffect(() => {
    document.addEventListener("visibilitychange", () => {
      if (document.visibilityState === "visible") {
        loginCheck()
      }
    })
    loginCheck()
    getTasks()
  }, [])

  // to submit signIn data to the backend
  const submitSigninForm = (e) => {
    e.preventDefault()
    document.querySelectorAll('input').forEach((element) => { element.setAttribute("disabled", true) })
    changeLoading(true)
    changeErrorMessage("")
    const fetchData = async () => {
      const response = await fetch('/usersignin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          "username": `${formUsername}`,
          "password": `${formPassword}`
        })
      })
      if (response.ok) {
        changeFormUsername("")
        changeFormPassword("")
        changeErrorMessage("")
        changeLoading(false)
        changeIsLoggedIn(true)
        loginCheck()
        getTasks()
      } else if (response.status === 400){
        changeLoading(false)
        changeErrorMessage("Wrong username or password.")
        document.querySelectorAll('input').forEach((element) => { element.removeAttribute("disabled") })
      } else {
        changeLoading(false)
        changeErrorMessage("Internal server error, please try again later.")
        document.querySelectorAll('input').forEach((element) => { element.removeAttribute("disabled") })
      }
    }
    fetchData()
  }

  // runs when you click on logout button
  const handleLogOut = () => {
    const logoutRequest = async () => {
      const response = await fetch("/logout")
      if (response.ok) {
        window.location.reload()
      }
    }
    logoutRequest()
  }


  // to check if there is a "dark_mode" property stored in local storage, 
  // if not then it will make one with dark mode being the default.
  useEffect(() => {
    if (window.localStorage.getItem("dark_mode") === null) {
      window.localStorage.setItem("dark_mode", "dark")
      changeDarkMode("dark")
    } else {
      changeDarkMode(window.localStorage.getItem("dark_mode"))
    }
  },[])

  // toggle between light and dark mode
  useEffect(() => {
    if (darkMode !== "") {
      window.localStorage.setItem("dark_mode", darkMode)
    }

    if (darkMode === "light") {
      document.body.className = "light_mode"
    } else {
      document.body.className = ""
    }
  },[darkMode])


  // to add today's date to the date input whenever you open the app
  useEffect(() => {
    const date = new Date()
    if (date.getMonth() + 1 < 10){
      var month = `0${date.getMonth() + 1}`
    } else {
      month = date.getMonth() + 1
    }
    if (date.getDate() < 10){
      var day = `0${date.getDate()}`
    } else {
      day = date.getDate()
    }
    const year = date.getFullYear()
    changeAddDate(`${year}-${month}-${day}`)
  },[])

  // to change priority state for the form
  const addPriorityFunction = (e, color) => {
    e.preventDefault()
    document.getElementById("priority_low").classList.remove("nav_priority_selected")
    document.getElementById("priority_medium").classList.remove("nav_priority_selected")
    document.getElementById("priority_high").classList.remove("nav_priority_selected")
    document.getElementById(e.target.id).classList.add("nav_priority_selected")
    changeAddPriority([e.target.id, color])
    document.documentElement.style.setProperty('--priority-dynamic-clr', color)
  }

  // to change date state from the new task form
  const addTimeFunction = (e) => {
    e.preventDefault()
    document.getElementById("priority_date").classList.remove("nav_priority_selected")
    document.getElementById("priority_day").classList.remove("nav_priority_selected")
    document.getElementById("priority_none").classList.remove("nav_priority_selected")
    document.getElementById(e.target.id).classList.add("nav_priority_selected")
    changeAddTime(e.target.id)
  }


  // to get the tasks from backend, will get called multiple times: when you save/delete/complete and load the page.
  const getTasks = () => {
    const fetchData = async () => {
      changeTasksIsLoading(true)
      const response = await fetch("/gettasks")
      const jsoned = await response.json()
      if(response.status === 200){
        changeTasksList(jsoned.reverse())
        changeNoTasks("No tasks found.")
      } else if(response.status === 404){
        changeNoTasks("An error occurred, couldn't load the tasks")
      }
      changeTasksIsLoading(false)
    }
    fetchData()
  }

  // function for adding new task form.
  const handleFormSubmit = (e) => {
    changeOperationMessage("")
    e.preventDefault()
    const length = document.getElementsByClassName("add_main")[0].elements.length
    for (let index = 0; index < length; index++) {
      document.getElementsByClassName("add_main")[0].elements[index].setAttribute("disabled", "true")
    }
    document.getElementsByClassName("add_only")[0].style.opacity = "40%"
    document.getElementsByClassName("add_textarea")[0].style.opacity = "40%"
    document.getElementsByClassName("add_send")[0].style.opacity = "40%"

    const fetchData = async () => {
      const response = await fetch('/addtask', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: addText,
          date: addDate,
          time: addTime,
          priority: addPriority,
          completed: false
        })
      })
      if(response.status === 201){
        changeAddText("")
        changeEditingIndex("")
        changeOperationMessage(["Saved!", "#35db24"])
        getTasks()
      } else {
        changeOperationMessage(["Couldn't save the new task.", "#ff2a2c"])
      }
      for (let index = 0; index < length; index++) {
        document.getElementsByClassName("add_main")[0].elements[index].removeAttribute("disabled")
      }
      document.getElementsByClassName("add_only")[0].style.opacity = "100%"
      document.getElementsByClassName("add_textarea")[0].style.opacity = "100%"
      document.getElementsByClassName("add_send")[0].style.opacity = "100%"
    }
    fetchData()
  }

  // when you change the priority on navbar
  const navPriorityFunction = (e) => {
    document.getElementsByClassName("nav_priority_mobile")[0].classList.remove("nav_priority_nav_selected")
    document.getElementsByClassName("nav_priority_mobile")[1].classList.remove("nav_priority_nav_selected")
    document.getElementsByClassName("nav_priority_mobile")[2].classList.remove("nav_priority_nav_selected")
    
    if(navPriority === e.target.name) {
      changeNavPriority("any")
    } else {
      changeNavPriority(e.target.name)
      document.getElementsByName(e.target.name)[0].classList.add("nav_priority_nav_selected")
    }
  }

  //  when you change the time on navbar
  const navTimeFunction = (e) => {
    changeNavTime(e.target.name)
    document.getElementsByClassName("nav_time_mobile")[0].classList.remove("nav_time_selected")
    document.getElementsByClassName("nav_time_mobile")[1].classList.remove("nav_time_selected")
    document.getElementsByClassName("nav_time_mobile")[2].classList.remove("nav_time_selected")
    document.getElementsByClassName("nav_time_mobile")[3].classList.remove("nav_time_selected")

    document.getElementsByName(e.target.name)[0].classList.add("nav_time_selected")
  }

  // to rotate the show/hide button on navbar when using mobile view.
  const navMobileListFunction = () => {
    changeNavMobileList(!navMobileList)
    if (!navMobileList) {
      document.getElementsByClassName("nav_main")[0].classList.add("nav_mobile_list")
      document.getElementsByClassName("nav_show_hide")[0].style.transform = "rotate(-90deg)"
    } else {
      document.getElementsByClassName("nav_main")[0].classList.remove("nav_mobile_list")
      document.getElementsByClassName("nav_show_hide")[0].style.transform = "rotate(0deg)"
    }
  }

  // to make message when you make a new task for example disappear after 2 seconds.
  useEffect(() => {
    const timeout = setTimeout(() => {
      changeOperationMessage("")
    }, 2000)
    return () => clearTimeout(timeout)
  },[operationMessage, tasksList])


  // to handle changing a task to "completed"
  const handleCheckboxChange = (task) => {
    task.completed = !task.completed
    changeTasksList([...tasksList])
    const updateTask = async () => {
      const response = await fetch(`/completedtask/${task._id}`)
      var taskText = task.text
      if(taskText.length > 10){
        taskText = taskText.substr(0,10) + "..."
      }
      if(response.status === 200){
        getTasks()
        if(task.completed){
          changeOperationMessage([`"${taskText}" task is marked as completed now, you can find it in "Complete" tab.`, "#35db24"])
        } else {
          changeOperationMessage([`"${taskText}" task is marked as not completed now.`, "#35db24"])
        }
      }
    }
    updateTask()
  }

  // to handle deleting a task.
  const handleDelete = (task) => {
    const fetchDelete = async () => {
      const response = await fetch(`/deletetask/${task._id}`)
      if(response.status === 200){
        changeSingleTaskPriority("")
        changeSingleTaskDate("")
        changeSingleTaskTime("")
        changeSingleTaskText("")
        changeEditingIndex("")
        var taskText = task.text
        if (taskText.length > 10) {
          taskText = taskText.substr(0, 10) + "..."
        }
        changeOperationMessage([`"${taskText}" task deleted successfully.`, "#35db24"])
      } else {
        changeOperationMessage([`"${taskText}" task deletion failed.`, "#ff2a2c"])
      }
      getTasks()
    }
    if (window.confirm(`Are you sure you want to delete "${task.text}" task?`)) {
      fetchDelete()
    }
  }

  // to handle saving changes to an existing task
  const handleSave = (task) => {
    const sendTaskData = async () => {
      const response = await fetch('/edittask', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: task._id,
          text: singleTaskText,
          date: singleTaskDate,
          time: singleTaskTime,
          priority: singleTaskPriority,
        })
      })
      if(response.status === 200){
        getTasks()
        changeSingleTaskPriority("")
        changeSingleTaskDate("")
        changeSingleTaskTime("")
        changeSingleTaskText("")
        changeEditingIndex("")
        changeOperationMessage(["Changes saved!", "#35db24"])
      } else {
        changeOperationMessage(["An error occurred, couldn't save the changes.", "#ff2a2c"])
      }
    }
    sendTaskData()
  }

  // to handle "Delete all completed" button.
  const handleDeleteAll = () => {
    const fetchDeleteAll = async () => {
      const response = await fetch("/deletealltasks")
      const jsoned = await response.json()

      if(response.status === 200){
        getTasks()
        changeOperationMessage([`${jsoned.deletedCount} completed tasks were deleted successfully.`, "#35db24"])
      } else {
        changeOperationMessage(["An error occurred, couldn't delete the tasks.", "#ff2a2c"])
      }
    }
    if(window.confirm("Are you sure you want to delete all completed ta")){
      fetchDeleteAll()
    }
  }

  // to change the opacity of tasks and disable all buttons when tasks are loading.
  useEffect(() => {
    if(tasksIsLoading){
      document.querySelectorAll("button").forEach((element) => {
        element.disabled = true
      })
      document.querySelectorAll(".task_main").forEach((element) => {
        element.style.opacity = "40%"
      })
    } else {
      document.querySelectorAll("button").forEach((element) => {
        element.disabled = false
      })
      document.querySelectorAll(".task_main").forEach((element) => {
        element.style.opacity = "100%"
      })
    }
  },[tasksIsLoading])

  return(
    <AppContext.Provider value={{
      isLoggedIn,
      isChecked,
      formUsername,
      changeFormUsername,
      formPassword,
      changeFormPassword,
      submitSigninForm,
      loading,
      handleLogOut,
      errorMessage,
      userData,
      darkMode,
      changeDarkMode,
      addPriority,
      changeAddPriority,
      addPriorityFunction,
      addTimeFunction,
      addDate, 
      changeAddDate,
      addText, 
      changeAddText,
      handleFormSubmit,
      navPriority, 
      changeNavPriority,
      navTime,
      changeNavTime,
      operationMessage,
      tasksList,
      navPriorityFunction,
      navTimeFunction,
      navSearch, 
      changeNavSearch,
      navMobileList, 
      changeNavMobileList,
      navMobileListFunction,
      handleCheckboxChange,
      noTasks,
      editingIndex, 
      changeEditingIndex,
      singleTaskPriority, 
      changeSingleTaskPriority,
      singleTaskTime, 
      changeSingleTaskTime,
      singleTaskDate, 
      changeSingleTaskDate,
      singleTaskText, 
      changeSingleTaskText,
      handleDelete,
      handleSave,
      tasksIsLoading,
      handleDeleteAll
    }}>
      {children}
    </AppContext.Provider>
  )
}

export default Context


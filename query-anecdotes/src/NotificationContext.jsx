import { createContext, useState, useContext } from 'react'

const NotificationContext = createContext()

export const NotificationContextProvider = (props) => {
  const [notification, setNotification] = useState(null)

  return (
    <NotificationContext.Provider value={[notification, setNotification]}>
      {props.children}
    </NotificationContext.Provider>
  )
}

export const useNotificationValue = () => {
  const context = useContext(NotificationContext)
  return context[0]
}

let timeoutId = null;

export const useNotify = () => {
  const context = useContext(NotificationContext)
  const setNotification = context[1]

  return (message, seconds = 5) => {
    if (timeoutId) {
      clearTimeout(timeoutId)
    }

    setNotification(message)
    timeoutId = setTimeout(() => {
      setNotification(null)
      timeoutId = null
    }, seconds * 1000)
  }
}

export default NotificationContext
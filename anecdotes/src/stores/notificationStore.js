import { create } from 'zustand'

let timeoutId = null

const useNotificationStore = create((set) => ({
  message: null,
  actions: {
    setNotification: (message, seconds = 5) => {
      if (timeoutId) clearTimeout(timeoutId)
      set({ message })

      timeoutId = setTimeout(() => {
        set ({ message: null })
        timeoutId = null
      }, seconds * 1000)
    }
  }
}))

export const useNotificationMessage = () => useNotificationStore(state => state.message)
export const useNotificationActions = () => useNotificationStore(state => state.actions)
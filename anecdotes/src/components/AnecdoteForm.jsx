import { useAnecdoteActions } from '../stores/anecdoteStore'
import { useNotificationActions } from '../stores/notificationStore'

function AnecdoteForm() {
  const { createAnecdote } = useAnecdoteActions()
  const { setNotification } = useNotificationActions()

  const addAnecdote = (e) => {
    e.preventDefault()
    const content = e.target.anecdote.value || ''
    createAnecdote(content)
    setNotification(`you created '${content}'`)
  }

  return (
    <div>
      <h2>create new</h2>
      <form onSubmit={addAnecdote}>
        <div>
          <input name='anecdote' />
        </div>
        <button type='submit'>create</button>
      </form>
    </div>
  )
}

export default AnecdoteForm;
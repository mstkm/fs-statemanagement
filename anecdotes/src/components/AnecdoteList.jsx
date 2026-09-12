import { useAnecdotes, useAnecdoteActions } from "../stores/anecdoteStore"
import { useNotificationActions } from '../stores/notificationStore'

function AnecdoteList() {
  const anecdotes = useAnecdotes()
  const { voteOf, deleteAnecdote } = useAnecdoteActions()
  const { setNotification } = useNotificationActions()

  const vote = async (id) => {
    await voteOf(id)
    const anecdote = anecdotes.find(a => a.id === id)
    setNotification(`you voted '${anecdote.content}'`)
  }

  const remove = async (id) => {
    await deleteAnecdote(id)
    const anecdote = anecdotes.find(a => a.id === id)
    setNotification(`deleted '${anecdote.content}'`)
  }

  return (
    <div>
      {anecdotes.map((anecdote) => (
        <div key={anecdote.id}>
          <div>{anecdote.content}</div>
          <div>
            has {anecdote.votes}
            <button onClick={() => vote(anecdote.id)}>vote</button>
            {anecdote.votes === 0 && (
              <button
                onClick={() => remove(anecdote.id)}
                style={{ marginLeft: 5 }}
              >
                delete
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  )
} 

export default AnecdoteList;
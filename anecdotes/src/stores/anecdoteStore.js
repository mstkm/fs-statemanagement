
import { create } from 'zustand'
import anecdoteService from '../services/anecdotes'

const useAnecdoteStore = create((set, get) => ({
  anecdotes: [],
  filter: '',
  actions: {
    voteOf: async (id) => {
      const anecdote = get().anecdotes.find(a => a.id === id)
      const updated = await anecdoteService.update(id, { ...anecdote, votes: anecdote.votes + 1 })
      set((state) => ({ anecdotes: state.anecdotes.map((a) => a.id === id ? updated : a) }))
    },
    createAnecdote: async (content) => {
      const newAnecdote = await anecdoteService.createNew(content)
      set((state) => ({ anecdotes: state.anecdotes.concat(newAnecdote) }))
    },
    setFilter: (value) => set(({ filter: value })),
    initialize: async () => {
      const anecdotes = await anecdoteService.getAll()
      set(() => ({ anecdotes }))
    },
    deleteAnecdote: async (id) => {
      const anecdote = get().anecdotes.find((a) => a.id === id)
      if (anecdote && anecdote.votes === 0) {
        await anecdoteService.remove(id)
        set((state) => ({ anecdotes: state.anecdotes.filter((a) => a.id !== id) }))
      }
    },
  }
}))

export const useAnecdotes = () => {
  const anecdotes = useAnecdoteStore((state) => state.anecdotes)
  const filter = useAnecdoteStore((state) => state.filter)
  const filteredAnecdotes = anecdotes.filter(a => a.content.toLowerCase().includes(filter.toLowerCase()))
  return filteredAnecdotes.sort((a, b) => b.votes - a.votes)
}
export const useAnecdoteActions = () => useAnecdoteStore((state) => state.actions)

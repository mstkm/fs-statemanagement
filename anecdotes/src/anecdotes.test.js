import { vi, describe, beforeEach, it, expect } from 'vitest'
import useAnecdoteStore, { useAnecdoteActions, useAnecdotes } from './stores/anecdoteStore'
import anecdoteService from './services/anecdotes'
import { renderHook, act } from '@testing-library/react'

vi.mock('./services/anecdotes', () => ({
  default: {
    getAll: vi.fn(),
    createNew: vi.fn(),
    update: vi.fn(),
    remove: vi.fn(),
  }
}))

describe('Anecdotes Store & Hooks', () => {
  const initialData = [
    { id: '1', content: 'If it hurts, do it more often', votes: 1 },
    { id: '2', content: 'Adding manpower to a late software project makes it later!', votes: 5 },
    { id: '3', content: 'Premature optimization is the root of all evil', votes: 2 },
  ]

  beforeEach(() => {
    useAnecdoteStore.setState({ anecdotes: [], filter: '' })
    vi.clearAllMocks()
  })

  it('6.12: state is initialized with anecdotes returned by backend', async () => {
    const sortedInitialData = initialData.sort((a, b) => b.votes - a.votes)
    anecdoteService.getAll.mockResolvedValue(sortedInitialData)

    const { result: actions } = renderHook(() => useAnecdoteActions())

    await act(async () => {
      await actions.current.initialize()
    })

    const { result: anecdotes } = renderHook(() => useAnecdotes())
    expect(anecdotes.current).toEqual(sortedInitialData)
  })

  it('6.13: returns anecdotes sorted by votes descending', () => {
    useAnecdoteStore.setState({ anecdotes: initialData, filter: '' })

    const { result: anecdotes } = renderHook(() => useAnecdotes())

    expect(anecdotes.current[0].id).toBe('2')
    expect(anecdotes.current[1].id).toBe('3')
    expect(anecdotes.current[2].id).toBe('1')
  })

  it('6.14: returns properly filtered list of anecdotes', () => {
    useAnecdoteStore.setState({ anecdotes: initialData, filter: 'optimization' })

    const { result: anecdotes } = renderHook(() => useAnecdotes())

    expect(anecdotes.current).toHaveLength(1)
    expect(anecdotes.current[0].content).toContain('Premature optimization')
  })

  it('6.15: voting increases the number of votes for an anecdote', async () => {
    const sortedInitialData = initialData.sort((a, b) => b.votes - a.votes)
    useAnecdoteStore.setState({ anecdotes: sortedInitialData, filter: '' })
    
    const target = sortedInitialData[0]
    const updatedAnecdote = { ...target, votes: target.votes + 1 }
    anecdoteService.update.mockResolvedValue(updatedAnecdote)

    const { result: actions } = renderHook(() => useAnecdoteActions())

    await act(async () => {
      await actions.current.voteOf(target.id)
    })

    const { result: anecdotes } = renderHook(() => useAnecdotes())
    const votedItem = anecdotes.current.find(a => a.id === target.id)

    expect(votedItem.votes).toBe(6)
  })
})


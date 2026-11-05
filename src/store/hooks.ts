import { useEffect } from 'react'
import { useStore } from '@tanstack/react-store'
import { useMutation, useQuery } from 'convex/react'
import { v4 as uuidv4 } from 'uuid'

import { api } from '../../convex/_generated/api'
import {  actions, selectors, store } from './store'
import type {Conversation} from './store';
import type { Id } from '../../convex/_generated/dataModel'
import type { Message } from '../utils/ai'

// Resolved once at build time, so the hook chosen below never changes between renders.
const isConvexAvailable = Boolean(import.meta.env.VITE_CONVEX_URL)

export function useAppState() {
  const isLoading = useStore(store, selectors.getIsLoading)
  const prompts = useStore(store, selectors.getPrompts)

  return {
    isLoading,
    prompts,
    setLoading: actions.setLoading,
    createPrompt: actions.createPrompt,
    deletePrompt: actions.deletePrompt,
    setPromptActive: actions.setPromptActive,
    getActivePrompt: selectors.getActivePrompt,
  }
}

export interface ConversationsApi {
  conversations: Array<Conversation>
  currentConversationId: string | null
  currentConversation: Conversation | undefined
  setCurrentConversationId: (id: string | null) => void
  createNewConversation: (title?: string) => Promise<string>
  updateConversationTitle: (id: string, title: string) => Promise<void>
  deleteConversation: (id: string) => Promise<void>
  addMessage: (conversationId: string, message: Message) => Promise<void>
}

function useLocalState() {
  return {
    conversations: useStore(store, selectors.getConversations),
    currentConversationId: useStore(store, selectors.getCurrentConversationId),
    currentConversation: useStore(store, selectors.getCurrentConversation),
  }
}

function createLocalConversation(title: string) {
  const id = uuidv4()
  actions.addConversation({ id, title, messages: [] })
  return id
}

/** In-memory conversations (used when no Convex deployment is configured). */
function useLocalConversations(): ConversationsApi {
  return {
    ...useLocalState(),
    setCurrentConversationId: actions.setCurrentConversationId,
    createNewConversation: (title = 'New Conversation') =>
      Promise.resolve(createLocalConversation(title)),
    updateConversationTitle: (id, title) =>
      Promise.resolve(actions.updateConversationTitle(id, title)),
    deleteConversation: (id) => Promise.resolve(actions.deleteConversation(id)),
    addMessage: (conversationId, message) =>
      Promise.resolve(actions.addMessage(conversationId, message)),
  }
}

/** Conversations persisted in Convex, with optimistic local updates. */
function useConvexConversations(): ConversationsApi {
  const local = useLocalState()
  const convexConversations = useQuery(api.conversations.list)
  const createConversation = useMutation(api.conversations.create)
  const updateTitle = useMutation(api.conversations.updateTitle)
  const removeConversation = useMutation(api.conversations.remove)
  const addMessageToConversation = useMutation(api.conversations.addMessage)

  // Mirror the server list into the local store (including when it becomes empty)
  useEffect(() => {
    if (!convexConversations) return
    actions.setConversations(
      convexConversations.map((conv) => ({
        id: conv._id,
        title: conv.title,
        messages: conv.messages,
      })),
    )
  }, [convexConversations])

  return {
    ...local,
    setCurrentConversationId: actions.setCurrentConversationId,

    createNewConversation: async (title = 'New Conversation') => {
      const tempId = createLocalConversation(title)
      try {
        const convexId = await createConversation({ title, messages: [] })
        actions.updateConversationId(tempId, convexId)
        actions.setCurrentConversationId(convexId)
        return convexId
      } catch (error) {
        console.error('Failed to create conversation in Convex:', error)
        return tempId
      }
    },

    updateConversationTitle: async (id, title) => {
      actions.updateConversationTitle(id, title)
      try {
        await updateTitle({ id: id as Id<'conversations'>, title })
      } catch (error) {
        console.error('Failed to update conversation title in Convex:', error)
      }
    },

    deleteConversation: async (id) => {
      actions.deleteConversation(id)
      try {
        await removeConversation({ id: id as Id<'conversations'> })
      } catch (error) {
        console.error('Failed to delete conversation from Convex:', error)
      }
    },

    addMessage: async (conversationId, message) => {
      actions.addMessage(conversationId, message)
      try {
        await addMessageToConversation({
          conversationId: conversationId as Id<'conversations'>,
          message,
        })
      } catch (error) {
        console.error('Failed to add message to Convex:', error)
      }
    },
  }
}

export const useConversations = isConvexAvailable
  ? useConvexConversations
  : useLocalConversations

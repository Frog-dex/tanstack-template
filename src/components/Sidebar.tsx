import { useState } from 'react'
import { Check, Edit2, MessageCircle, PlusCircle, Settings, Trash2, X } from 'lucide-react'

interface SidebarProps {
  conversations: Array<{ id: string; title: string }>
  currentConversationId: string | null
  onNewChat: () => void
  onSelect: (id: string) => void
  onDelete: (id: string) => void
  onRename: (id: string, title: string) => void
  onOpenSettings: () => void
  /** Mobile drawer state; the sidebar is always visible from `md` up */
  isOpen: boolean
  onClose: () => void
}

export function Sidebar({
  conversations,
  currentConversationId,
  onNewChat,
  onSelect,
  onDelete,
  onRename,
  onOpenSettings,
  isOpen,
  onClose,
}: SidebarProps) {
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editingTitle, setEditingTitle] = useState('')

  const stopEditing = () => {
    setEditingId(null)
    setEditingTitle('')
  }

  const commit = (id: string) => {
    if (editingTitle.trim()) onRename(id, editingTitle.trim())
    stopEditing()
  }

  return (
    <>
      {/* Mobile backdrop */}
      <div
        aria-hidden
        onClick={onClose}
        className={`fixed inset-0 top-14 z-30 bg-black/40 backdrop-blur-sm transition-opacity md:hidden ${
          isOpen ? 'opacity-100' : 'pointer-events-none opacity-0'
        }`}
      />
      <aside
        aria-label="Conversations"
        className={`fixed top-14 bottom-0 left-0 z-30 flex w-72 flex-col border-r border-line bg-surface-2 transition-transform md:static md:z-auto md:w-64 md:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex items-center gap-2 border-b border-line p-3">
          <button
            type="button"
            onClick={onNewChat}
            className="bg-brand flex flex-1 items-center justify-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-white hover:opacity-90 focus:ring-2 focus:ring-accent focus:outline-none"
          >
            <PlusCircle className="size-4" />
            New Chat
          </button>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close sidebar"
            className="grid size-9 place-items-center rounded-lg text-muted hover:bg-surface-3 hover:text-fg md:hidden"
          >
            <X className="size-4" />
          </button>
        </div>

        <ul className="flex-1 overflow-y-auto p-2">
          {conversations.length === 0 && (
            <li className="px-3 py-6 text-center text-sm text-muted">
              No conversations yet.
            </li>
          )}
          {conversations.map((chat) => {
            const active = chat.id === currentConversationId
            return (
              <li key={chat.id}>
                <div
                  className={`group flex items-center gap-2 rounded-lg px-2.5 py-2 ${
                    active ? 'bg-surface-3 text-fg' : 'text-muted hover:bg-surface-3/60 hover:text-fg'
                  }`}
                >
                  <MessageCircle className="size-4 shrink-0" />
                  {editingId === chat.id ? (
                    <input
                      type="text"
                      aria-label="Conversation title"
                      value={editingTitle}
                      onChange={(e) => setEditingTitle(e.target.value)}
                      onFocus={(e) => e.target.select()}
                      onBlur={() => commit(chat.id)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') commit(chat.id)
                        else if (e.key === 'Escape') stopEditing()
                      }}
                      className="min-w-0 flex-1 rounded bg-surface px-1 text-sm text-fg focus:ring-1 focus:ring-accent focus:outline-none"
                      autoFocus
                    />
                  ) : (
                    <button
                      type="button"
                      onClick={() => onSelect(chat.id)}
                      aria-current={active ? 'true' : undefined}
                      className="min-w-0 flex-1 truncate text-left text-sm"
                    >
                      {chat.title}
                    </button>
                  )}
                  <div className="flex items-center gap-0.5 md:opacity-0 md:group-focus-within:opacity-100 md:group-hover:opacity-100">
                    {editingId === chat.id ? (
                      <button
                        type="button"
                        onMouseDown={(e) => e.preventDefault()}
                        onClick={() => commit(chat.id)}
                        aria-label="Save title"
                        className="p-1 hover:text-fg"
                      >
                        <Check className="size-3.5" />
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => {
                          setEditingId(chat.id)
                          setEditingTitle(chat.title)
                        }}
                        aria-label={`Rename ${chat.title}`}
                        className="p-1 hover:text-fg"
                      >
                        <Edit2 className="size-3.5" />
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => onDelete(chat.id)}
                      aria-label={`Delete ${chat.title}`}
                      className="p-1 hover:text-red-500"
                    >
                      <Trash2 className="size-3.5" />
                    </button>
                  </div>
                </div>
              </li>
            )
          })}
        </ul>

        <div className="border-t border-line p-3">
          <button
            type="button"
            onClick={onOpenSettings}
            className="flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-sm text-muted hover:bg-surface-3 hover:text-fg"
          >
            <Settings className="size-4" />
            System prompts
          </button>
        </div>
      </aside>
    </>
  )
}

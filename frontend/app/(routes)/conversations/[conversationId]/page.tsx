import React from 'react'
import EmptyState from '@/components/empty-state'
import Header from '@/components/conversations/conversationId/Header'
import Body from '@/components/conversations/conversationId/Body'
import Form from '@/components/conversations/conversationId/Form'
import { getConversationById } from '@/actions/getConversationById'
import { getMessagesById } from '@/actions/getMessagesById'

interface ConversationIdProps {
  params: Promise<{ conversationId: string }>;
}

export default async function ConversationId({ params }: ConversationIdProps) {
  const { conversationId } = await params;

  const conversation = await getConversationById(conversationId)
  const messages = await getMessagesById(conversationId)

  if (!conversation) {
    return (
      <div className="lg:pl-[460px] h-full">
        <div className="h-full flex flex-col">
          <EmptyState />
        </div>
      </div>
    )
  }

  return (
    <div className="lg:pl-[460px] h-full">
      <div className="h-full flex flex-col">
        <Header conversation={conversation} />
        <Body messages={messages} />
        <Form />
      </div>
    </div>
  )
}


import React, { useState, useEffect } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { db } from '@/lib/supabase'
import { formatDate } from '@/lib/utils'

export default function Messages({ user }) {
  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadMessages()
  }, [])

  const loadMessages = async () => {
    try {
      const { data, error } = await db.getMessages()
      if (error) throw error
      setMessages(data || [])
    } catch (error) {
      console.error('Error loading messages:', error)
    } finally {
      setLoading(false)
    }
  }

  const getMessageTypeColor = (type) => {
    switch (type) {
      case 'general':
        return 'bg-blue-100 text-blue-800'
      case 'order':
        return 'bg-green-100 text-green-800'
      case 'support':
        return 'bg-orange-100 text-orange-800'
      case 'system':
        return 'bg-purple-100 text-purple-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold text-gray-900">Messages</h1>
        <div className="animate-pulse space-y-4">
          {[1, 2, 3].map((i) => (
            <Card key={i}>
              <CardContent className="p-4">
                <div className="h-20 bg-gray-200 rounded"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Messages</h1>
        <p className="text-gray-600 mt-2">View your messages and communications.</p>
      </div>

      <div className="space-y-4">
        {messages.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <div className="text-gray-500">
                <h3 className="text-lg font-medium mb-2">No messages found</h3>
                <p>You don't have any messages yet.</p>
              </div>
            </CardContent>
          </Card>
        ) : (
          messages.map((message) => (
            <Card key={message.id} className={`hover:shadow-md transition-shadow ${!message.is_read ? 'border-blue-200 bg-blue-50' : ''}`}>
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="font-semibold text-lg text-gray-900">{message.subject}</h3>
                    <p className="text-sm text-gray-600 mt-1">
                      {formatDate(message.created_at)}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Badge className={`text-xs ${getMessageTypeColor(message.message_type)}`}>
                      {message.message_type || 'general'}
                    </Badge>
                    {!message.is_read && (
                      <Badge className="text-xs bg-blue-100 text-blue-800">
                        Unread
                      </Badge>
                    )}
                  </div>
                </div>
                
                <div className="text-sm text-gray-700">
                  <p className="whitespace-pre-wrap">{message.content}</p>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}
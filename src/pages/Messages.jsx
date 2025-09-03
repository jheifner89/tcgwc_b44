import React, { useState, useEffect } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Search, Eye, Reply, Archive } from 'lucide-react'
import { db } from '@/lib/supabase'
import { formatDate } from '@/lib/utils'
import { useToast } from '@/hooks/use-toast'

export default function Messages({ user }) {
  const [messages, setMessages] = useState([])
  const [filteredMessages, setFilteredMessages] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [typeFilter, setTypeFilter] = useState('all')
  const [readFilter, setReadFilter] = useState('all')
  const { toast } = useToast()

  useEffect(() => {
    loadMessages()
  }, [])

  useEffect(() => {
    filterMessages()
  }, [messages, searchTerm, typeFilter, readFilter])

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

  const filterMessages = () => {
    let filtered = messages

    if (searchTerm) {
      filtered = filtered.filter(message =>
        message.subject?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        message.content?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    if (typeFilter !== 'all') {
      filtered = filtered.filter(message => message.message_type === typeFilter)
    }

    if (readFilter !== 'all') {
      const isRead = readFilter === 'read'
      filtered = filtered.filter(message => message.is_read === isRead)
    }

    setFilteredMessages(filtered)
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

  const handleMarkAsRead = async (messageId) => {
    try {
      const { error } = await db.markMessageAsRead(messageId)
      if (error) throw error
      
      setMessages(prev => prev.map(msg => 
        msg.id === messageId ? { ...msg, is_read: true } : msg
      ))
    } catch (error) {
      console.error('Error marking message as read:', error)
    }
  }

  const handleReply = (message) => {
    // TODO: Implement reply functionality
    console.log('Reply to message:', message.id)
    toast({
      title: "Feature Coming Soon",
      description: "Reply functionality needs to be implemented",
      variant: "warning"
    })
  }

  const handleArchive = (message) => {
    // TODO: Implement archive functionality
    console.log('Archive message:', message.id)
    toast({
      title: "Feature Coming Soon",
      description: "Archive functionality needs to be implemented",
      variant: "warning"
    })
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
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Messages</h1>
          <p className="text-gray-600 mt-2">View your messages and communications.</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow-sm border">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search messages..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger>
              <SelectValue placeholder="All Types" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="general">General</SelectItem>
              <SelectItem value="order">Order</SelectItem>
              <SelectItem value="support">Support</SelectItem>
              <SelectItem value="system">System</SelectItem>
            </SelectContent>
          </Select>
          <Select value={readFilter} onValueChange={setReadFilter}>
            <SelectTrigger>
              <SelectValue placeholder="All Messages" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Messages</SelectItem>
              <SelectItem value="unread">Unread</SelectItem>
              <SelectItem value="read">Read</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-4">
        {filteredMessages.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <div className="text-gray-500">
                <h3 className="text-lg font-medium mb-2">No messages found</h3>
                <p>
                  {messages.length === 0 
                    ? "You don't have any messages yet." 
                    : "No messages match your current filters."
                  }
                </p>
              </div>
            </CardContent>
          </Card>
        ) : (
          filteredMessages.map((message) => (
            <Card 
              key={message.id} 
              className={`hover:shadow-md transition-shadow ${!message.is_read ? 'border-blue-200 bg-blue-50' : ''}`}
            >
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg text-gray-900">{message.subject}</h3>
                    <p className="text-sm text-gray-600 mt-1">
                      {formatDate(message.created_at)}
                      {message.related_id && (
                        <span className="ml-4">Related ID: {message.related_id.slice(0, 8)}</span>
                      )}
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
                
                <div className="text-sm text-gray-700 mb-4">
                  <p className="whitespace-pre-wrap line-clamp-3">{message.content}</p>
                </div>

                <div className="flex justify-between items-center">
                  <div className="text-xs text-gray-500">
                    Message ID: {message.id.slice(0, 8)}
                  </div>
                  <div className="flex gap-2">
                    {!message.is_read && (
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => handleMarkAsRead(message.id)}
                      >
                        Mark as Read
                      </Button>
                    )}
                    <Button size="sm" variant="outline">
                      <Eye className="h-4 w-4 mr-2" />
                      View
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => handleReply(message)}
                    >
                      <Reply className="h-4 w-4 mr-2" />
                      Reply
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => handleArchive(message)}
                    >
                      <Archive className="h-4 w-4 mr-2" />
                      Archive
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}
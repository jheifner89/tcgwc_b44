import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { db } from '@/lib/supabase'
import { formatDate } from '@/lib/utils'

export default function MyRequests({ user }) {
  const [requests, setRequests] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadRequests()
  }, [])

  const loadRequests = async () => {
    try {
      const { data, error } = await db.getRequests()
      if (error) throw error
      setRequests(data || [])
    } catch (error) {
      console.error('Error loading requests:', error)
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800'
      case 'in_progress':
        return 'bg-blue-100 text-blue-800'
      case 'completed':
        return 'bg-green-100 text-green-800'
      case 'cancelled':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'urgent':
        return 'bg-red-100 text-red-800'
      case 'high':
        return 'bg-orange-100 text-orange-800'
      case 'medium':
        return 'bg-blue-100 text-blue-800'
      case 'low':
        return 'bg-gray-100 text-gray-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold text-gray-900">My Requests</h1>
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
        <h1 className="text-3xl font-bold text-gray-900">My Requests</h1>
        <p className="text-gray-600 mt-2">Track your product requests and their status.</p>
      </div>

      <div className="space-y-4">
        {requests.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <div className="text-gray-500">
                <h3 className="text-lg font-medium mb-2">No requests found</h3>
                <p>You haven't submitted any product requests yet.</p>
              </div>
            </CardContent>
          </Card>
        ) : (
          requests.map((request) => (
            <Card key={request.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="font-semibold text-lg text-gray-900">{request.subject}</h3>
                    <p className="text-sm text-gray-600 mt-1">
                      Submitted on {formatDate(request.created_at)}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Badge className={`text-xs ${getStatusColor(request.status)}`}>
                      {request.status?.replace('_', ' ') || 'pending'}
                    </Badge>
                    <Badge className={`text-xs ${getPriorityColor(request.priority)}`}>
                      {request.priority || 'medium'}
                    </Badge>
                  </div>
                </div>
                
                <div className="text-sm text-gray-700 mb-4">
                  <p className="whitespace-pre-wrap">{request.message}</p>
                </div>

                <div className="flex justify-between items-center text-xs text-gray-500">
                  <span>Customer: {request.customer_name} ({request.customer_email})</span>
                  {request.updated_at !== request.created_at && (
                    <span>Last updated: {formatDate(request.updated_at)}</span>
                  )}
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}
import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { DollarSign } from 'lucide-react'
import { formatCurrency, formatDate } from '@/lib/utils'

export default function SpendHistory({ totalSpent, spendHistory }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <DollarSign className="h-5 w-5" />
          Spend History
        </CardTitle>
        <CardDescription>Your recent spending activity</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
            <span className="font-medium">Total Spent</span>
            <span className="text-lg font-bold text-green-600">
              {formatCurrency(totalSpent)}
            </span>
          </div>
          
          <div className="space-y-3">
            {spendHistory.length === 0 ? (
              <div className="text-center text-gray-500 py-4">
                <p>No spending history yet</p>
              </div>
            ) : (
              spendHistory.map((item) => (
                <div key={item.id} className="flex justify-between items-center py-2 border-b border-gray-100 last:border-0">
                  <div>
                    <p className="font-medium text-sm">{item.description}</p>
                    <p className="text-xs text-gray-500">{formatDate(item.date)}</p>
                  </div>
                  <span className="font-medium">{formatCurrency(item.amount)}</span>
                </div>
              ))
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
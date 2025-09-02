import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { 
  Package, 
  FileText, 
  ShoppingCart, 
  MessageSquare, 
  Truck, 
  Settings,
  HelpCircle,
  LogOut,
  User
} from 'lucide-react'
import { auth } from '@/lib/supabase'

const navigation = [
  { name: 'Products', href: '/products', icon: Package },
  { name: 'My Requests', href: '/requests', icon: HelpCircle },
  { name: 'My Invoices', href: '/invoices', icon: FileText },
  { name: 'Orders', href: '/orders', icon: ShoppingCart },
  { name: 'My Orders', href: '/my-orders', icon: ShoppingCart },
  { name: 'My Shipments', href: '/my-shipments', icon: Truck },
  { name: 'Messages', href: '/messages', icon: MessageSquare },
  { name: 'Admin Dashboard', href: '/admin', icon: Settings },
  { name: 'Settings', href: '/settings', icon: Settings },
]

export default function Layout({ children, user }) {
  const location = useLocation()

  const handleSignOut = async () => {
    await auth.signOut()
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg">
        <div className="flex h-16 items-center justify-center border-b border-gray-200">
          <h1 className="text-xl font-bold text-gray-900">Base44 App</h1>
        </div>
        
        <nav className="mt-8 px-4">
          <ul className="space-y-2">
            {navigation.map((item) => {
              const isActive = location.pathname === item.href
              return (
                <li key={item.name}>
                  <Link
                    to={item.href}
                    className={`flex items-center px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                      isActive
                        ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-700'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    }`}
                  >
                    <item.icon className="mr-3 h-5 w-5" />
                    {item.name}
                  </Link>
                </li>
              )
            })}
          </ul>
        </nav>

        {/* User section */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <User className="h-5 w-5 text-gray-400 mr-2" />
              <span className="text-sm text-gray-600 truncate">
                {user?.email || 'User'}
              </span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleSignOut}
              className="text-gray-400 hover:text-gray-600"
            >
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="pl-64">
        <main className="py-8 px-8">
          {children}
        </main>
      </div>
    </div>
  )
}
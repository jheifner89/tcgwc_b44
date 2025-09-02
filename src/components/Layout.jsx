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
  User,
  LayoutDashboard
} from 'lucide-react'
import { auth } from '@/lib/supabase'

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Products', href: '/products', icon: Package },
  { name: 'My Requests', href: '/requests', icon: HelpCircle },
  { name: 'My Invoices', href: '/invoices', icon: FileText },
  { name: 'My Orders', href: '/orders', icon: ShoppingCart },
  { name: 'My Shipments', href: '/shipments', icon: Truck },
  { name: 'Admin Dashboard', href: '/admin', icon: Settings },
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
          <div className="flex items-center">
            <div className="w-8 h-8 bg-red-600 rounded-full flex items-center justify-center mr-3">
              <span className="text-white font-bold text-sm">TC</span>
            </div>
            <h1 className="text-xl font-bold text-gray-900">TCGWC</h1>
          </div>
        </div>
        
        <div className="mt-4 px-4">
          <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
            NAVIGATION
          </div>
          <nav>
            <ul className="space-y-1">
              {navigation.map((item) => {
                const isActive = location.pathname === item.href
                return (
                  <li key={item.name}>
                    <Link
                      to={item.href}
                      className={`flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                        isActive
                          ? 'bg-gray-100 text-gray-900'
                          : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                      }`}
                    >
                      <item.icon className="mr-3 h-4 w-4" />
                      {item.name}
                    </Link>
                  </li>
                )
              })}
            </ul>
          </nav>
        </div>

        {/* User section */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200">
          <div className="bg-gray-50 rounded-lg p-3 mb-3">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center">
                <User className="h-4 w-4 text-gray-400 mr-2" />
                <span className="text-sm font-medium text-gray-900">
                  {user?.email?.split('@')[0] || 'User'}
                </span>
              </div>
            </div>
            <div className="text-xs text-gray-500 mb-1">Admin</div>
            <div className="space-y-1 text-xs">
              <div className="flex justify-between">
                <span className="text-gray-500">Membership</span>
                <span className="text-blue-600 font-medium">Admin Access</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Account Credit</span>
                <span className="font-medium">$100.00</span>
              </div>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleSignOut}
            className="w-full text-gray-600 hover:text-gray-900"
          >
            <LogOut className="h-4 w-4 mr-2" />
            Sign Out
          </Button>
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
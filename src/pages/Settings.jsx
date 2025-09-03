import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Save, User, Bell, Shield, CreditCard } from 'lucide-react'
import { db } from '@/lib/supabase'
import { useToast } from '@/hooks/use-toast'

export default function Settings({ user }) {
  const [settings, setSettings] = useState({})
  const [userProfile, setUserProfile] = useState({
    name_or_company: '',
    street_address: '',
    suite: '',
    city: '',
    state: '',
    zip: '',
    tax_id: ''
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    loadSettings()
    loadUserProfile()
  }, [])

  const loadSettings = async () => {
    try {
      const { data, error } = await db.getSettings()
      if (error) throw error
      
      const settingsObj = {}
      data?.forEach(setting => {
        settingsObj[setting.key] = setting.value
      })
      setSettings(settingsObj)
    } catch (error) {
      console.error('Error loading settings:', error)
    } finally {
      setLoading(false)
    }
  }

  const loadUserProfile = async () => {
    // TODO: Load user profile from users table
    // This would need to be implemented based on the users table structure
    console.log('Load user profile for:', user?.id)
  }

  const handleSaveSetting = async (key, value) => {
    setSaving(true)
    try {
      const { error } = await db.updateSetting(key, value)
      if (error) throw error
      
      setSettings(prev => ({ ...prev, [key]: value }))
      toast({
        title: "Setting Saved",
        description: "Your setting has been saved successfully!",
        variant: "success"
      })
    } catch (error) {
      console.error('Error saving setting:', error)
      toast({
        title: "Save Failed",
        description: "Error saving setting",
        variant: "destructive"
      })
    } finally {
      setSaving(false)
    }
  }

  const handleSaveProfile = async () => {
    setSaving(true)
    try {
      // TODO: Implement user profile update
      console.log('Save user profile:', userProfile)
      toast({
        title: "Feature Coming Soon",
        description: "Profile update functionality needs to be implemented",
        variant: "warning"
      })
    } catch (error) {
      console.error('Error saving profile:', error)
      toast({
        title: "Save Failed",
        description: "Error saving profile",
        variant: "destructive"
      })
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
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
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-600 mt-2">Manage your account and application settings.</p>
      </div>

      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="profile" className="flex items-center gap-2">
            <User className="h-4 w-4" />
            Profile
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex items-center gap-2">
            <Bell className="h-4 w-4" />
            Notifications
          </TabsTrigger>
          <TabsTrigger value="security" className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            Security
          </TabsTrigger>
          <TabsTrigger value="billing" className="flex items-center gap-2">
            <CreditCard className="h-4 w-4" />
            Billing
          </TabsTrigger>
        </TabsList>

        {/* Profile Tab */}
        <TabsContent value="profile" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
              <CardDescription>Update your personal and company information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name_or_company">Name or Company</Label>
                  <Input
                    id="name_or_company"
                    value={userProfile.name_or_company}
                    onChange={(e) => setUserProfile(prev => ({ ...prev, name_or_company: e.target.value }))}
                    placeholder="Enter your name or company name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="tax_id">Tax ID (Optional)</Label>
                  <Input
                    id="tax_id"
                    value={userProfile.tax_id}
                    onChange={(e) => setUserProfile(prev => ({ ...prev, tax_id: e.target.value }))}
                    placeholder="Enter tax ID"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="street_address">Street Address</Label>
                <Input
                  id="street_address"
                  value={userProfile.street_address}
                  onChange={(e) => setUserProfile(prev => ({ ...prev, street_address: e.target.value }))}
                  placeholder="Enter street address"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="suite">Suite/Unit</Label>
                  <Input
                    id="suite"
                    value={userProfile.suite}
                    onChange={(e) => setUserProfile(prev => ({ ...prev, suite: e.target.value }))}
                    placeholder="Suite/Unit"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="city">City</Label>
                  <Input
                    id="city"
                    value={userProfile.city}
                    onChange={(e) => setUserProfile(prev => ({ ...prev, city: e.target.value }))}
                    placeholder="City"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="state">State</Label>
                  <Input
                    id="state"
                    value={userProfile.state}
                    onChange={(e) => setUserProfile(prev => ({ ...prev, state: e.target.value }))}
                    placeholder="State"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="zip">ZIP Code</Label>
                  <Input
                    id="zip"
                    value={userProfile.zip}
                    onChange={(e) => setUserProfile(prev => ({ ...prev, zip: e.target.value }))}
                    placeholder="ZIP"
                  />
                </div>
              </div>

              <Button onClick={handleSaveProfile} disabled={saving}>
                <Save className="h-4 w-4 mr-2" />
                {saving ? 'Saving...' : 'Save Profile'}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notifications Tab */}
        <TabsContent value="notifications" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Notification Preferences</CardTitle>
              <CardDescription>Configure how you receive notifications</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="email-notifications">Email Notifications</Label>
                    <p className="text-sm text-gray-500">Receive notifications via email</p>
                  </div>
                  <Checkbox
                    id="email-notifications"
                    checked={settings.email_notifications !== 'disabled'}
                    onCheckedChange={(checked) => 
                      handleSaveSetting('email_notifications', checked ? 'enabled' : 'disabled')
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="order-notifications">Order Updates</Label>
                    <p className="text-sm text-gray-500">Get notified about order status changes</p>
                  </div>
                  <Checkbox
                    id="order-notifications"
                    checked={settings.order_notifications !== 'disabled'}
                    onCheckedChange={(checked) => 
                      handleSaveSetting('order_notifications', checked ? 'enabled' : 'disabled')
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="request-notifications">Request Updates</Label>
                    <p className="text-sm text-gray-500">Get notified about request status changes</p>
                  </div>
                  <Checkbox
                    id="request-notifications"
                    checked={settings.request_notifications !== 'disabled'}
                    onCheckedChange={(checked) => 
                      handleSaveSetting('request_notifications', checked ? 'enabled' : 'disabled')
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="marketing-emails">Marketing Emails</Label>
                    <p className="text-sm text-gray-500">Receive promotional and marketing emails</p>
                  </div>
                  <Checkbox
                    id="marketing-emails"
                    checked={settings.marketing_emails !== 'disabled'}
                    onCheckedChange={(checked) => 
                      handleSaveSetting('marketing_emails', checked ? 'enabled' : 'disabled')
                    }
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Security Tab */}
        <TabsContent value="security" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Security Settings</CardTitle>
              <CardDescription>Manage your account security</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="current-email">Current Email</Label>
                  <Input
                    id="current-email"
                    value={user?.email || ''}
                    disabled
                    className="bg-gray-50"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="new-password">Change Password</Label>
                  <Input
                    id="new-password"
                    type="password"
                    placeholder="Enter new password"
                  />
                  <Input
                    id="confirm-password"
                    type="password"
                    placeholder="Confirm new password"
                  />
                  <Button variant="outline" disabled>
                    Update Password
                  </Button>
                  <p className="text-xs text-red-600">⚠️ Password change functionality needs to be implemented</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Billing Tab */}
        <TabsContent value="billing" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Billing Information</CardTitle>
              <CardDescription>Manage your billing and payment methods</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-medium">Account Credit</span>
                  <span className="text-lg font-bold text-green-600">$100.00</span>
                </div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-gray-600">Membership Status</span>
                  <span className="text-sm font-medium text-blue-600">Admin Access</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Reseller Status</span>
                  <span className="text-sm font-medium">Active</span>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <Label>Payment Methods</Label>
                  <div className="mt-2 p-4 border rounded-lg text-center text-gray-500">
                    <p>No payment methods on file</p>
                    <Button variant="outline" className="mt-2" disabled>
                      Add Payment Method
                    </Button>
                    <p className="text-xs text-red-600 mt-2">⚠️ Payment method management needs to be implemented</p>
                  </div>
                </div>

                <div>
                  <Label>Billing History</Label>
                  <div className="mt-2 p-4 border rounded-lg text-center text-gray-500">
                    <p>No billing history available</p>
                    <p className="text-xs text-red-600 mt-2">⚠️ Billing history functionality needs to be implemented</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
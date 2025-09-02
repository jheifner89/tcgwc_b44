import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { db } from '@/lib/supabase'

export default function Settings({ user }) {
  const [settings, setSettings] = useState({})
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    loadSettings()
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

  const handleSaveSetting = async (key, value) => {
    setSaving(true)
    try {
      const { error } = await db.updateSetting(key, value)
      if (error) throw error
      
      setSettings(prev => ({ ...prev, [key]: value }))
    } catch (error) {
      console.error('Error saving setting:', error)
      alert('Error saving setting')
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
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-600 mt-2">Manage your account and application settings.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>General Settings</CardTitle>
            <CardDescription>Basic application configuration</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="company-name">Company Name</Label>
              <Input
                id="company-name"
                value={settings.company_name || ''}
                onChange={(e) => setSettings(prev => ({ ...prev, company_name: e.target.value }))}
                placeholder="Enter company name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="company-email">Company Email</Label>
              <Input
                id="company-email"
                type="email"
                value={settings.company_email || ''}
                onChange={(e) => setSettings(prev => ({ ...prev, company_email: e.target.value }))}
                placeholder="Enter company email"
              />
            </div>
            <Button 
              onClick={() => {
                handleSaveSetting('company_name', settings.company_name)
                handleSaveSetting('company_email', settings.company_email)
              }}
              disabled={saving}
            >
              {saving ? 'Saving...' : 'Save Changes'}
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Notification Settings</CardTitle>
            <CardDescription>Configure how you receive notifications</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email-notifications">Email Notifications</Label>
              <select 
                id="email-notifications"
                className="w-full p-2 border rounded-md"
                value={settings.email_notifications || 'enabled'}
                onChange={(e) => setSettings(prev => ({ ...prev, email_notifications: e.target.value }))}
              >
                <option value="enabled">Enabled</option>
                <option value="disabled">Disabled</option>
              </select>
            </div>
            <Button 
              onClick={() => handleSaveSetting('email_notifications', settings.email_notifications)}
              disabled={saving}
            >
              {saving ? 'Saving...' : 'Save Changes'}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
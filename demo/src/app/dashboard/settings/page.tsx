'use client'

import { useState } from 'react'
import { PageShell, Breadcrumbs, Card, Input, Select, Button, AlertBanner } from '@lucifer91299/ui'

const THEME_OPTIONS = [
  { value: 'default', label: 'Default (Navy / Saffron / Green)' },
  { value: 'dark',    label: 'Dark (Indigo / Amber / Emerald)' },
  { value: 'minimal', label: 'Minimal (Slate / Blue / Green)' },
]

const SIDEBAR_OPTIONS = [
  { value: 'full', label: 'Full — wide sidebar with labels' },
  { value: 'rail', label: 'Rail — icon-only narrow sidebar' },
  { value: 'both', label: 'Both — full on desktop, rail on mobile' },
]

export default function SettingsPage() {
  const [saved, setSaved]         = useState(false)
  const [theme, setTheme]         = useState('default')
  const [sidebar, setSidebar]     = useState('full')
  const [projectName, setProject] = useState('Portal Demo')
  const [apiUrl, setApiUrl]       = useState('http://localhost:3000')

  function handleSave() {
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  return (
    <div className="p-6 space-y-6">
      <PageShell
        title="Settings"
        subtitle="Configure your portal appearance and connection settings."
        breadcrumbs={<Breadcrumbs items={[{ label: 'Settings' }]} />}
        actions={
          <Button variant="primary" onClick={handleSave}>Save changes</Button>
        }
      />

      {saved && <AlertBanner variant="success" message="Settings saved successfully." />}

      {/* Appearance */}
      <Card className="p-6">
        <h3 className="text-callout font-semibold text-label-primary mb-4">Appearance</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Project name"
            value={projectName}
            onChange={(e) => setProject(e.target.value)}
            placeholder="My Portal"
          />
          <Select
            label="Theme preset"
            options={THEME_OPTIONS}
            value={theme}
            onChange={setTheme}
          />
          <Select
            label="Sidebar style"
            options={SIDEBAR_OPTIONS}
            value={sidebar}
            onChange={setSidebar}
          />
        </div>
      </Card>

      {/* Connection */}
      <Card className="p-6">
        <h3 className="text-callout font-semibold text-label-primary mb-4">Connection</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Backend API URL"
            value={apiUrl}
            onChange={(e) => setApiUrl(e.target.value)}
            placeholder="http://localhost:3000"
            helperText="Used by the API client for all requests."
          />
          <Input
            label="JWT cookie name"
            defaultValue="access_token"
            helperText="Must match the cookie set by your login route."
          />
        </div>
      </Card>

      {/* About */}
      <Card className="p-6">
        <h3 className="text-callout font-semibold text-label-primary mb-3">About</h3>
        <div className="space-y-1 text-body text-label-secondary">
          <p><span className="text-label-primary font-medium">SDK:</span> @lucifer91299/ui v1.0.4</p>
          <p><span className="text-label-primary font-medium">CLI:</span> @lucifer91299/create-portal-app v1.0.4</p>
          <p><span className="text-label-primary font-medium">Demo credentials:</span> admin@demo.com / password123</p>
        </div>
        <div className="mt-3 flex gap-3">
          <a href="https://www.npmjs.com/package/@lucifer91299/ui" target="_blank" rel="noopener noreferrer">
            <Button variant="secondary" size="sm">npm package</Button>
          </a>
          <a href="https://github.com/aakashkanojiya91299/nexportal" target="_blank" rel="noopener noreferrer">
            <Button variant="ghost" size="sm">GitHub</Button>
          </a>
        </div>
      </Card>
    </div>
  )
}

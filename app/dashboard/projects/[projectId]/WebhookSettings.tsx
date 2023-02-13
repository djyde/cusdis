'use client'

import { Button } from "../../../components/ui/Button"
import { Input } from "../../../components/ui/Input"

export function WebhookSettingsBody() {
  return (
    <div>
      <Input className="w-full" />
    </div>
  )
}

export function WebhookSettingsActions() {
  return (
    <div>
      <Button variant="primary" className="text-sm">Save</Button>
    </div>
  )
}
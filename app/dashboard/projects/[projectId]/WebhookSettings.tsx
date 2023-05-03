'use client'

import { Button } from "../../../components/ui/Button"
import { Input } from "../../../components/ui/Input"
import { StateButton } from "../../../components/ui/StateButton"

export function WebhookSettingsBody() {
  return (
    <div>
      <Input type="text" className="w-full" />
    </div>
  )
}

export function WebhookSettingsActions() {
  return (
    <div>
      <StateButton size="sm" className="px-4">Save</StateButton>
    </div>
  )
}
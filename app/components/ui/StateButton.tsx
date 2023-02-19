'use client'

import { Button, ButtonProps } from "./Button";
import { Loader2 } from "lucide-react"

export type StateButtonProps = ButtonProps & {
  isLoading?: boolean
}
export function StateButton(props: StateButtonProps) {
  const { isLoading, ...buttonProps } = props
  if (!isLoading) {
    return (
      <Button {...buttonProps} />
    )
  } else {
    return (
      <Button {...buttonProps} disabled={isLoading}>
        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        {props.children}
      </Button>
    )
  }
}
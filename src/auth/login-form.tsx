"use client"

import { useActionState } from "react"
import { LogIn, TriangleAlert } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Spinner } from "@/components/ui/spinner"
import {
  Field,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { login, type LoginState } from "@/auth/actions"

export function LoginForm({ from }: { from?: string }) {
  const [state, formAction, pending] = useActionState<LoginState, FormData>(login, {})

  return (
    <form action={formAction} className="flex flex-col gap-5">
      <input type="hidden" name="from" value={from ?? "/admin"} />

      {state.error && (
        <div
          role="alert"
          className="flex items-center gap-2 rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive"
        >
          <TriangleAlert className="size-4 shrink-0" />
          {state.error}
        </div>
      )}

      <FieldGroup className="gap-4">
        <Field>
          <FieldLabel htmlFor="email">Email</FieldLabel>
          <Input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            placeholder="you@example.com"
            defaultValue="admin@acme.dev"
            required
          />
        </Field>
        <Field>
          <FieldLabel htmlFor="password">Parol</FieldLabel>
          <Input
            id="password"
            name="password"
            type="password"
            autoComplete="current-password"
            placeholder="••••••••"
            defaultValue="admin123"
            required
          />
        </Field>
      </FieldGroup>

      <Button type="submit" disabled={pending} className="w-full">
        {pending ? <Spinner /> : <LogIn />}
        Kirish
      </Button>
    </form>
  )
}

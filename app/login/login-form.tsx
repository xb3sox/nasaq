'use client'

import { useActionState } from 'react'
import { authenticate } from './actions'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"


export function LoginForm() {
  const [errorMessage, formAction, isPending] = useActionState(
    authenticate,
    undefined,
  )

  return (
    <form action={formAction} className="space-y-4">
      <div className="space-y-1.5">
        <Label htmlFor="email">البريد الإلكتروني</Label>
        <Input
          id="email"
          name="email"
          type="email"
          inputMode="email"
          placeholder="owner@clinic.com"
          dir="ltr"
          autoComplete="email"
          aria-invalid={errorMessage ? "true" : "false"}
          required
        />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="password">كلمة المرور</Label>
        <Input
          id="password"
          name="password"
          type="password"
          placeholder="••••••••"
          autoComplete="current-password"
          aria-invalid={errorMessage ? "true" : "false"}
          required
        />
      </div>

      <div className="rounded-lg bg-primary/5 border border-primary/20 p-3 text-xs text-muted-foreground space-y-2">
        <div className="font-semibold text-primary">معلومات الدخول للتجربة (Demo)</div>
        <div className="flex justify-between items-center">
          <span>البريد الإلكتروني:</span>
          <code dir="ltr" className="font-mono bg-background px-1.5 py-0.5 rounded border text-foreground">owner@clinic.com</code>
        </div>
        <div className="flex justify-between items-center">
          <span>كلمة المرور:</span>
          <code dir="ltr" className="font-mono bg-background px-1.5 py-0.5 rounded border text-foreground">demo1234</code>
        </div>
      </div>

      <Button className="w-full" size="lg" type="submit" disabled={isPending} aria-disabled={isPending}>
        {isPending ? 'جاري تسجيل الدخول...' : 'تسجيل الدخول'}
      </Button>

      <div aria-live="polite" aria-atomic="true">
        {errorMessage && (
          <div className="text-sm text-destructive text-center mt-2" role="alert">
            {errorMessage === 'Invalid credentials.' ? 'بيانات الدخول غير صحيحة' : 'حدث خطأ ما'}
          </div>
        )}
      </div>
    </form>
  )
}

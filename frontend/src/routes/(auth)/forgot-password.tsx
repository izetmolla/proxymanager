import ForgotPassword from '@/features/auth/forgot-password'
import { createFileRoute, redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/(auth)/forgot-password')({
  beforeLoad: ({ context }) => {
    if (context.auth?.signedIn) {
      throw redirect({ to: '/' })
    }
  },
  component: ForgotPassword,
})

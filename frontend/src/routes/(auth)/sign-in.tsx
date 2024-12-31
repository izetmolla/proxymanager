import { createFileRoute, redirect } from '@tanstack/react-router'
import SignIn from '@/features/auth/sign-in'

export const Route = createFileRoute('/(auth)/sign-in')({
  beforeLoad: ({ context }) => {
    if (context.auth?.signedIn) {
      throw redirect({ to: "/" });
    }
  },
  component: SignIn,
})

import { createFileRoute, redirect } from '@tanstack/react-router'
import SignIn from '@/features/auth/sign-in'

export const Route = createFileRoute('/(auth)/sign-in')({
  beforeLoad: ({ context }) => {
    if (!context?.setup && window.location.pathname !== '/setup') {
      throw redirect({ to: "/setup" });
    }
    if (context.auth?.signedIn) {
      throw redirect({ to: "/" });
    }
  },
  component: SignIn,
})

import SetUpApp from '@/features/setup'
import { createFileRoute, redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/(auth)/setup')({
    beforeLoad: ({ context }) => {
      if (context?.setup) {
        throw redirect({ to: "/sign-in" });
      }
      
    },
  component: SetUpApp,
})
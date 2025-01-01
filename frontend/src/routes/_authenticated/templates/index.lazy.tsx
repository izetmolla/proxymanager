import Templates from '@/features/templates'
import { createLazyFileRoute } from '@tanstack/react-router'

export const Route = createLazyFileRoute('/_authenticated/templates/')({
  component: Templates,
})


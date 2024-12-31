import UpTime from '@/features/uptime'
import { createLazyFileRoute } from '@tanstack/react-router'

export const Route = createLazyFileRoute('/_authenticated/uptime/')({
  component: UpTime,
})



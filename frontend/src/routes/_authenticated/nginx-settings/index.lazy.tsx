import NginxSettings from '@/features/nginx-settings'
import { createLazyFileRoute } from '@tanstack/react-router'

export const Route = createLazyFileRoute('/_authenticated/nginx-settings/')({
  component: NginxSettings,
})


import NginxFile from '@/features/nginxfile'
import { createLazyFileRoute } from '@tanstack/react-router'

export const Route = createLazyFileRoute('/_authenticated/nginx-settings/')({
  component: NginxFile,
})


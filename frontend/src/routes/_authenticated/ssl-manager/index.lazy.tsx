import SslManagerList from '@/features/sslmanager/list'
import { createLazyFileRoute } from '@tanstack/react-router'

export const Route = createLazyFileRoute('/_authenticated/ssl-manager/')({
  component: SslManagerList,
})


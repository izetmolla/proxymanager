import EditProxyManager from '@/features/proxymanager/edit'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_authenticated/proxy-manager/$id/$nav/')(
  {
    component: EditProxyManager,
  },
)

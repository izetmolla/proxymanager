import ProxyManagerList from '@/features/proxymanager/list'
import { createLazyFileRoute } from '@tanstack/react-router'

export const Route = createLazyFileRoute('/_authenticated/proxy-manager/')({
  component: ProxyManagerList,
})

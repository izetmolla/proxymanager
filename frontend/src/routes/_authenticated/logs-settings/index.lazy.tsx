import { createLazyFileRoute } from '@tanstack/react-router'

export const Route = createLazyFileRoute('/_authenticated/logs-settings/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/_authenticated/logs-settings/"!</div>
}

import { createLazyFileRoute } from '@tanstack/react-router'

export const Route = createLazyFileRoute('/_authenticated/ssl-manager/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/_authenticated/ssl-manager/"!</div>
}

import { createLazyFileRoute } from '@tanstack/react-router'

export const Route = createLazyFileRoute('/_authenticated/upstreams/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/_authenticated/upstreams/"!</div>
}

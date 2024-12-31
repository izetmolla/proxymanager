import { createLazyFileRoute } from '@tanstack/react-router'

export const Route = createLazyFileRoute('/_authenticated/access-list/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/_authenticated/access-list/"!</div>
}

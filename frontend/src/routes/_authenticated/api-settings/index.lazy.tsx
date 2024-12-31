import { createLazyFileRoute } from '@tanstack/react-router'

export const Route = createLazyFileRoute('/_authenticated/api-settings/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/_authenticated/api-settings/"!</div>
}

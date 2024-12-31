import { createLazyFileRoute } from '@tanstack/react-router'

export const Route = createLazyFileRoute('/_authenticated/general-settings/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/_authenticated/general-settings/"!</div>
}

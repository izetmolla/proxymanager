import { createLazyFileRoute } from '@tanstack/react-router'

export const Route = createLazyFileRoute('/_authenticated/account/')({
    component: RouteComponent,
})

function RouteComponent() {
    return <div>Hello "/_authenticated/account/"!</div>
}
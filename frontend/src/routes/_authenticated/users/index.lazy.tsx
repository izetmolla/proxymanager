import UsersList from '@/features/users/list'
import { createLazyFileRoute } from '@tanstack/react-router'

export const Route = createLazyFileRoute('/_authenticated/users/')({
  component: UsersList,
})

import EditSslKey from '@/features/sslmanager/edit'
import { createLazyFileRoute } from '@tanstack/react-router'

export const Route = createLazyFileRoute('/_authenticated/ssl-manager/$id/')({
  component: EditSslKey,
})
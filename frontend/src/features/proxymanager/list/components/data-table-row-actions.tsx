import { DotsHorizontalIcon } from '@radix-ui/react-icons'
import { Row, Table } from '@tanstack/react-table'
import { IconTrash } from '@tabler/icons-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useProxyManagersContext } from '../proxymanager-context'
import { ProxyHostType } from '@/types/proxyhost'
import { useRouter } from '@tanstack/react-router'

interface DataTableRowActionsProps<TData> {
  row: Row<TData>
  table: Table<TData>
}

export function DataTableRowActions<TData>({
  row,
  table
}: DataTableRowActionsProps<TData>) {
  const router = useRouter()
  const { setOpen, setCurrentRow } = useProxyManagersContext()

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <Button
          variant='ghost'
          className='flex text-right h-8 w-8 p-0 data-[state=open]:bg-muted'
        >
          <DotsHorizontalIcon className='h-4 w-4' />
          <span className='sr-only'>Open menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align='end' className='w-[160px]'>
        <DropdownMenuItem
          onClick={() => router.navigate({
            to: "/proxy-manager/$id/$nav",
            params: {
              id: (row.original as ProxyHostType).id,
              nav: 'overview',
            },
          })}
        >
          Edit
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const { handleChangeStatus } = table.options.meta as any
            const { id, status } = row.original as ProxyHostType
            if (handleChangeStatus) {
              handleChangeStatus(id, status == "active" ? "disable" : "enable")
            }
          }}
        >
          {(row.original as ProxyHostType)?.status == "active" ? "Disable" : "Enable"}
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() => {
            setCurrentRow(row.original as ProxyHostType)
            setOpen('delete')
          }}
        >
          Delete
          <DropdownMenuShortcut>
            <IconTrash size={16} />
          </DropdownMenuShortcut>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

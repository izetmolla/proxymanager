import { DotsHorizontalIcon } from '@radix-ui/react-icons'
import { Row } from '@tanstack/react-table'
import { IconDownload, IconTrash } from '@tabler/icons-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useSslManagerContext } from '../sslmanager-context'
import { SslType } from '@/types/ssl'
import { downloadSslKey } from '@/services/ssl.service'
import { useToast } from '@/hooks/use-toast'

interface DataTableRowActionsProps<TData> {
  row: Row<TData>
}

export function DataTableRowActions<TData>({
  row,
}: DataTableRowActionsProps<TData>) {
  const { toast } = useToast()
  const { setOpen, setCurrentRow } = useSslManagerContext()

  const downloadSssl = (id: string) => {
    downloadSslKey(id).then((res) => res.data).then(({ error, data }) => {
      if (error) {
        toast({
          title: 'Error',
          description: error?.message,
          variant: "destructive",
        })
      } else {
        window.open(`/download.php?id=${data.id}`, '_blank')
      }
    }).catch((error) => {
      toast({
        title: 'Error',
        description: error?.message,
        variant: "destructive",
      })
    })
  }

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
          onClick={() => downloadSssl((row.original as SslType).id)}
        >
          Download
          <DropdownMenuShortcut>
            <IconDownload size={16} />
          </DropdownMenuShortcut>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() => {
            setCurrentRow(row.original as SslType)
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

import { ColumnDef } from '@tanstack/react-table'
import { Checkbox } from '@/components/ui/checkbox'
import { ProxyHostType } from '@/types/proxyhost'
import { statuses } from './data'
import { DataTableRowActions } from './data-table-row-actions'
import { DataTableColumnHeader } from '@/components/data-table/data-table-column-header'
import { Badge } from '@/components/ui/badge'
import { Link } from '@tanstack/react-router'
import { cn } from '@/lib/utils'
import LongText from '@/components/long-text'

export const columns: ColumnDef<ProxyHostType>[] = [
    {
        id: 'select',
        meta: {
            className: cn(
                'sticky md:table-cell left-0 z-10 rounded-tl',
                'bg-background transition-colors duration-200 group-hover/row:bg-muted group-data-[state=selected]/row:bg-muted'
            ),
        },
        header: ({ table }) => (
            <Checkbox
                checked={
                    table.getIsAllPageRowsSelected() ||
                    (table.getIsSomePageRowsSelected() && 'indeterminate')
                }
                onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
                aria-label='Select all'
                className='translate-y-[2px]'
            />
        ),
        cell: ({ row }) => (
            <Checkbox
                checked={row.getIsSelected()}
                onCheckedChange={(value) => row.toggleSelected(!!value)}
                aria-label='Select row'
                className='translate-y-[2px]'
            />
        ),
        enableSorting: false,
        enableHiding: false,
    },
    {
        accessorKey: 'domains',
        enableSorting: false,
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title='Domains' />
        ),

        meta: {
            className: cn(
                'drop-shadow-[0_1px_2px_rgb(0_0_0_/_0.1)] dark:drop-shadow-[0_1px_2px_rgb(255_255_255_/_0.1)] lg:drop-shadow-none',
                'bg-background transition-colors duration-200 group-hover/row:bg-muted group-data-[state=selected]/row:bg-muted',
                'sticky left-6 md:table-cell'
            ),
        },
        enableHiding: false,
        cell: ({ row }) => {
            const domains = row.original.domains
            return (
                <div className='flex space-x-2'>
                    <span className='max-w-32 truncate font-medium sm:max-w-72 md:max-w-[31rem] gap-2'>
                        <Link to='/proxy-manager/$id/$nav' params={{ id: row.original.id, nav: 'overview' }}>
                            {domains.map((x, i) => {
                                return <Badge key={i} variant="outline">{x}</Badge>
                            })}
                        </Link>
                    </span>
                </div>
            )
        },
    },
    {
        accessorKey: 'status',
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title='Status' />
        ),
        cell: ({ row }) => {
            const status = statuses.find(
                (status) => status.value === row.getValue('status')
            )

            if (!status) {
                return null
            }

            return (
                <div className='flex w-[100px] items-center'>
                    {status.icon && (
                        <status.icon className='mr-2 h-4 w-4 text-muted-foreground' />
                    )}
                    <span>{status.label}</span>
                </div>
            )
        },
        filterFn: (row, id, value) => {
            return value.includes(row.getValue(id))
        },
    },
    {
        accessorKey: 'ssl',
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title='SSL Keys' />
        ),
        cell: ({ row }) => (<LongText>{row.original.ssl ?? "none"}</LongText>),
    },
    {
        id: 'actions',
        cell: ({ row }) => <DataTableRowActions row={row} />,
    },
]

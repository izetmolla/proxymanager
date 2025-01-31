import {
    // ColumnDef,
    flexRender,
    useReactTable,
} from '@tanstack/react-table'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table'
import { DataTablePagination } from './data-table-pagination'



export const DEFAULT_PAGE_INDEX = 0;
export const DEFAULT_PAGE_SIZE = 10;




// interface DataTableProps {
//     // columns: ColumnDef<TData, TValue>[]
//     // data: TData[]
//     table: ReturnType<typeof useReactTable>
// }

interface DataTableProps<TData> {
    table: ReturnType<typeof useReactTable<TData>>
}

export function DataTable<T>({
    table,
}: DataTableProps<T>) {
    // const [rowSelection, setRowSelection] = React.useState({})
    // const [columnVisibility, setColumnVisibility] =
    //     React.useState<VisibilityState>({})
    // const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
    // const [sorting, setSorting] = React.useState<SortingState>([])

    // const table = useReactTable({
    //     data,
    //     columns,
    //     state: {
    //         sorting,
    //         columnVisibility,
    //         rowSelection,
    //         columnFilters,
    //     },
    //     enableRowSelection: true,
    //     onRowSelectionChange: setRowSelection,
    //     onSortingChange: setSorting,
    //     onColumnFiltersChange: setColumnFilters,
    //     onColumnVisibilityChange: setColumnVisibility,
    //     getCoreRowModel: getCoreRowModel(),
    //     getFilteredRowModel: getFilteredRowModel(),
    //     getPaginationRowModel: getPaginationRowModel(),
    //     getSortedRowModel: getSortedRowModel(),
    //     getFacetedRowModel: getFacetedRowModel(),
    //     getFacetedUniqueValues: getFacetedUniqueValues(),
    // })

    return (
        <div className='space-y-4'>
            {/* <DataTableToolbar table={table} /> */}
            <div className='rounded-md border'>
                <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => {
                                    return (
                                        <TableHead key={header.id} colSpan={header.colSpan}>
                                            {header.isPlaceholder
                                                ? null
                                                : flexRender(
                                                    header.column.columnDef.header,
                                                    header.getContext()
                                                )}
                                        </TableHead>
                                    )
                                })}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow
                                    key={row.id}
                                    data-state={row.getIsSelected() && 'selected'}
                                >
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell key={cell.id}>
                                            {flexRender(
                                                cell.column.columnDef.cell,
                                                cell.getContext()
                                            )}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell
                                    colSpan={table.getAllColumns().length}
                                    className='h-24 text-center'
                                >
                                    No results.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
            <DataTablePagination table={table} />
        </div>
    )
}

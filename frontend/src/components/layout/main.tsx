import React from 'react'
import { cn } from '@/lib/utils'
import { CustomBreadcrumb } from './breadcrumb'

interface MainProps extends React.HTMLAttributes<React.ElementRef<'main'>> {
    fixed?: boolean
    title?: string
    rightComponent?: React.ReactNode
    bareadcrumb?: { name: string, href?: string }[]
    description?: string
    loading?: boolean
    error?: string
}

export const Main = React.forwardRef<React.ElementRef<'main'>, MainProps>(
    ({ fixed, title, rightComponent, bareadcrumb, description, loading = false, error, ...props }, ref) => {
        return (
            <main
                ref={ref}
                className={cn(
                    'px-4 py-6',
                    fixed && 'flex flex-col flex-grow overflow-hidden'
                )}
                {...props}
            >
                {(title || rightComponent || bareadcrumb) && (
                    <div className='mb-2 flex items-center justify-between space-y-2 flex-wrap'>
                        <div>
                            <h2 className='text-2xl font-bold tracking-tight'>{title}</h2>
                            {description && <p className='text-muted-foreground'>
                                {description}
                            </p>}
                            {bareadcrumb && <CustomBreadcrumb breadcrumb={bareadcrumb} />}
                        </div>
                        {rightComponent && <div className='flex gap-2'>{rightComponent}</div>}
                    </div>
                )}
                {loading ? (
                    <div className="flex justify-center items-center h-[70vh]">
                        <span className="relative flex h-10 w-10">
                            <span
                                className="absolute inline-flex h-full w-full animate-ping rounded-full bg-blue-400 opacity-75"
                            ></span>
                            <span
                                className="relative inline-flex h-10 w-10 rounded-full bg-blue-300"
                            ></span>
                        </span>
                    </div>
                ) : error ? (
                    <div className="flex justify-center items-center h-[70vh]">
                        <p className="text-red-500">{error}</p>
                    </div>
                ) : props.children}

            </main>
        )
    }
)
Main.displayName = 'Main'

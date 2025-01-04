import React, { FC } from 'react'
import { Helmet } from 'react-helmet-async'

interface LoadingPageProps {
    children: React.ReactNode
    loading?: boolean
    error?: string
    meta?: {
        title?: string
        description?: string
        keywords?: string
        image?: string
    }
}

export const LoadingPage: FC<LoadingPageProps> = (({ loading = false, meta, error, ...props }) => {
    return (
        <>
            {meta && <Helmet>
                <title>{meta.title}</title>
            </Helmet>}

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
        </>

    )
})
LoadingPage.displayName = 'LoadingPage'

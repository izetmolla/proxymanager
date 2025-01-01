import { SslType } from '@/types/ssl'
import React from 'react'

export type SslManagerListDialogType = 'create' | 'update' | 'delete' | 'import'

interface SslManagerListContextType {
    open: SslManagerListDialogType | null
    setOpen: (str: SslManagerListDialogType | null) => void
    currentRow: SslType | null
    setCurrentRow: React.Dispatch<React.SetStateAction<SslType | null>>
}

const SslManagerListContext = React.createContext<SslManagerListContextType | null>(null)

interface Props {
    children: React.ReactNode
    value: SslManagerListContextType
}

export default function SslManagerListContextProvider({ children, value }: Props) {
    return <SslManagerListContext.Provider value={value}>{children}</SslManagerListContext.Provider>
}

// eslint-disable-next-line react-refresh/only-export-components
export const useSslManagerContext = () => {
    const sslManagersContext = React.useContext(SslManagerListContext)

    if (!sslManagersContext) {
        throw new Error(
            'useSslManagerContext has to be used within <SslManagerListContextProvider.Provider>'
        )
    }

    return sslManagersContext
}

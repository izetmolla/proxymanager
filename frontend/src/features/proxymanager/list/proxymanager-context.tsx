import { ProxyHostType } from '@/types/proxyhost'
import React from 'react'

export type ProxyManagersListDialogType = 'create' | 'update' | 'delete' | 'import'

interface ProxyManagersListContextType {
    open: ProxyManagersListDialogType | null
    setOpen: (str: ProxyManagersListDialogType | null) => void
    currentRow: ProxyHostType | null
    setCurrentRow: React.Dispatch<React.SetStateAction<ProxyHostType | null>>
}

const ProxyManagersListContext = React.createContext<ProxyManagersListContextType | null>(null)

interface Props {
    children: React.ReactNode
    value: ProxyManagersListContextType
}

export default function ProxyManagersListContextProvider({ children, value }: Props) {
    return <ProxyManagersListContext.Provider value={value}>{children}</ProxyManagersListContext.Provider>
}

// eslint-disable-next-line react-refresh/only-export-components
export const useProxyManagersContext = () => {
    const proxymanagersContext = React.useContext(ProxyManagersListContext)

    if (!proxymanagersContext) {
        throw new Error(
            'useProxyManagersContext has to be used within <ProxyManagersListContextProvider.Provider>'
        )
    }

    return proxymanagersContext
}

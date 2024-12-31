import { UserType } from '@/types/user'
import React from 'react'

export type UsersListDialogType = 'create' | 'update' | 'delete' | 'import'

interface UsersListContextType {
    open: UsersListDialogType | null
    setOpen: (str: UsersListDialogType | null) => void
    currentRow: UserType | null
    setCurrentRow: React.Dispatch<React.SetStateAction<UserType | null>>
}

const UsersListContext = React.createContext<UsersListContextType | null>(null)

interface Props {
    children: React.ReactNode
    value: UsersListContextType
}

export default function UsersListContextProvider({ children, value }: Props) {
    return <UsersListContext.Provider value={value}>{children}</UsersListContext.Provider>
}

// eslint-disable-next-line react-refresh/only-export-components
export const useUsersContext = () => {
    const usersContext = React.useContext(UsersListContext)

    if (!usersContext) {
        throw new Error(
            'useUsersContext has to be used within <UsersListContextProvider.Provider>'
        )
    }

    return usersContext
}

import {
    IconCircleCheck,
    IconCirclePlus,
    IconCircleX
} from '@tabler/icons-react'

export const statuses = [
    {
        value: 'created',
        label: 'Created',
        icon: IconCirclePlus,
    }, {
        value: 'active',
        label: 'Active',
        icon: IconCircleCheck,
    },
    {
        value: 'disabled',
        label: 'Disabled',
        icon: IconCircleX,
    }
]


export interface ProxyHostType {
    id: string
    name: string
    status: string
    domains: string[]
    enableSSL : boolean
    locations: {
        path: string
        proxy_pass: string
        properties: string[]
    }[]
    ssl?: string
    createdAt: string
    updatedAt: string
}

export const extractProxyPass = (url: string) => {
    const [protocol, host] = url.split('://')
    return { protocol, host }
}

export const extractProxyPassFromLocations = (locations: { path: string, proxy_pass: string, properties: string[] }[]) => {
    if (!locations?.length) return { protocol: '', host: '' }
    const { protocol, host } = extractProxyPass(locations[0].proxy_pass)
    return { protocol, host }
}
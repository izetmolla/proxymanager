import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form'
import CreatableSelect from 'react-select/creatable'
import { useState } from 'react'
import FormFooter from '@/components/form-footer'
import FormGroup from '@/components/form-group'


import { ProxyHostType } from '@/types/proxyhost'
import { saveProxyHostOverview } from '@/services/proxyhost.service'
import { useToast } from '@/hooks/use-toast'
import ProxyPassInput from '@/components/proxy-pass-input'
import { extractProxyPassFromLocations } from '@/utils/proxypass'

const formSchema = z
    .object({
        id: z.string().min(1, { message: 'Id is required.' }),
        domains: z.array(z.object({
            label: z.string(),
            value: z.string()
        })).min(1, { message: 'One domain name is required.' }),
        protocol: z.string().min(1, { message: 'Protocol is required.' }),
        host: z.string().min(1, { message: 'Host is required.' }),
    })
export type OverviewForm = z.infer<typeof formSchema>

interface Props {
    proxyHost: ProxyHostType
}

export function ProxyHostOverviewForm({
    proxyHost
}: Props) {
    const { toast } = useToast()
    const [lloading, setLoading] = useState(false)
    const { protocol, host } = extractProxyPassFromLocations(proxyHost.locations)
    const form = useForm<OverviewForm>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            id: proxyHost.id,
            domains: proxyHost.domains.map((d) => ({ label: d, value: d })),
            protocol: protocol ?? 'http',
            host: host ?? '',
        }
    })

    const onSubmit = (body: OverviewForm) => {
        setLoading(true)
        saveProxyHostOverview(body).then(res => res.data)
            .then(({ error, data }) => {
                if (error) {
                    if (error?.path === 'domains') {
                        form.setError('domains', { message: error.message })
                    } else {
                        toast({
                            variant: 'destructive',
                            title: `Internal Server Error: ! ${error?.message}`,
                        })
                    }
                    setLoading(false)
                } else {
                    console.log(data)
                    toast({
                        variant: "default",
                        title: "Updated Successfully",
                        description: "The proxy host overview has been updated successfully.",
                    })
                    setLoading(false)
                }
            }).catch((error) => {
                setLoading(false)
                toast({
                    variant: 'destructive',
                    title: `Internal Server Error: ! ${error?.message}`,
                })
            })
    }


    return (
        <div className="flex flex-grow flex-col px-0 pb-6 pt-2 md:px-0 lg:px-6 lg:pb-8 3xl:px-0 3xl:pt-4 4xl:px-0 4xl:pb-9">
            <Form {...form}>
                <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="@container"
                >
                    <div className="mb-10 mt-2 grid gap-7 divide-y divide-dashed divide-gray-200 @2xl:gap-9 @3xl:gap-11">
                        <FormGroup
                            title="Domain names"
                            description="Enter Your Domain Names Here"
                        >
                            <div className='col-span-full'>
                                <FormField
                                    control={form.control}
                                    name='domains'
                                    render={({ field }) => (
                                        <FormItem
                                            className='col-span-6'
                                        >
                                            <FormLabel className='col-span-2 text-right'>
                                                Domain Names
                                            </FormLabel>
                                            <FormControl>
                                                <CreatableSelect
                                                    className='col-span-4 col-start-3'
                                                    isMulti={true}
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage className='col-span-4 col-start-3' />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            <ProxyPassInput control={form.control} hostProps={{ placeholder: 'localhost:3000' }} protocolProps={{}} />

                        </FormGroup>
                    </div>
                    <FormFooter
                        isLoading={lloading}
                        submitBtnText={"Save changes"}
                    />
                </form>
            </Form>
        </div>
    )
}

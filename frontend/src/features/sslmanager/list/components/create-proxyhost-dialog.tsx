'use client'

import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@/components/ui/button'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog'
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form'
import { ProxyHostType } from '@/types/proxyhost'
import { createProxyHost } from '@/services/proxyhost.service'
import { useState } from 'react'
import { useRouter } from '@tanstack/react-router'
import CreatableSelect from 'react-select/creatable'
import ProxyPassInput from '@/components/proxy-pass-input'
import { useForm } from 'react-hook-form'
import { IconPlus } from '@tabler/icons-react'
import { Checkbox } from '@/components/ui/checkbox'
import { Loader2 } from "lucide-react"

const formSchema = z
    .object({
        domains: z.array(z.object({
            label: z.string(),
            value: z.string()
        })).min(1, { message: 'One domain name is required.' }),
        host: z.string().min(1, { message: 'Host is required.' }),
        protocol: z.string().min(1, { message: 'Protocol is required.' }),
        enableSSL: z.boolean(),
    })
export type CreateProxyHostForm = z.infer<typeof formSchema>

interface Props {
    currentRow?: ProxyHostType
    open: boolean
    onOpenChange: (open: boolean) => void
}

export function CreateProxyHost({ open, onOpenChange }: Props) {
    const [loading, setLoading] = useState(false)
    const router = useRouter()
    const [error, setError] = useState<string | null>(null)
    const form = useForm<CreateProxyHostForm>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            domains: [],
            host: '',
            protocol: 'http',
            enableSSL: true,
        }
    })

    const onSubmit = (body: CreateProxyHostForm) => {
        setLoading(true)
        createProxyHost(body)
            .then((res) => res.data)
            .then(({ error, data }) => {
                if (error) {
                    setError(error.message)
                    setLoading(false)
                } else {
                    if (data.id) {
                        form.reset()
                        onOpenChange(false)
                        router.navigate({
                            to: '/proxy-manager/$id/$nav', params: {
                                id: data.id,
                                nav: 'overview',
                            }
                        })
                    }
                    setLoading(false)
                }
            }).catch((e) => {
                setError(e?.message ?? 'An error occurred')
                setLoading(false)
            })
    }


    return (
        <Dialog
            open={open}
            onOpenChange={(state) => {
                form.reset()
                onOpenChange(state)
            }}
        >
            <DialogContent className='sm:max-w-lg'>
                <DialogHeader className='text-left'>
                    <DialogTitle>Add new Proxy Host</DialogTitle>
                    <DialogDescription>
                        {error && <p className='text-red-500'>{error}</p>}
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form
                        id='user-form'
                        onSubmit={form.handleSubmit(onSubmit)}
                        className='space-y-2 p-0.5'
                    >
                        <FormField
                            control={form.control}
                            name='domains'
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className='col-span-2 text-right'>
                                        Domain Names
                                    </FormLabel>
                                    <FormControl>
                                        <CreatableSelect
                                            isMulti={true}
                                            placeholder='Enter Domain Names'
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage className='col-span-4 col-start-3' />
                                </FormItem>
                            )}
                        />

                        <ProxyPassInput control={form.control} protocolProps={{}} hostProps={{}} />
                        <div>

                            <FormField
                                control={form.control}
                                name="enableSSL"
                                render={({ field }) => (
                                    <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 shadow">
                                        <FormControl>
                                            <Checkbox
                                                checked={field.value}
                                                onCheckedChange={field.onChange}
                                            />
                                        </FormControl>
                                        <div className="space-y-1 leading-none">
                                            <FormLabel>
                                                This feature will generalte self SSL certificates.
                                            </FormLabel>
                                        </div>
                                    </FormItem>
                                )}
                            />

                        </div>
                    </form>
                </Form>
                <DialogFooter>
                    <Button type='submit' form='user-form' disabled={loading}>
                        {loading && <Loader2 className="animate-spin" />} Create Host <IconPlus />
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

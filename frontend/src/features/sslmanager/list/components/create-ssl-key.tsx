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
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/components/ui/tabs"
import { ProxyHostType } from '@/types/proxyhost'
import { useState } from 'react'
import CreatableSelect from 'react-select/creatable'
import { useForm } from 'react-hook-form'
import { IconPlus } from '@tabler/icons-react'
import { Loader2 } from "lucide-react"
import { createSslKey } from '@/services/ssl.service'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'

const formSchema = z
    .object({
        ssl_type: z.string().min(1, { message: 'SSL Type is required.' }),
        name: z.string().min(1, { message: 'Name is required.' }),

        ssl_certificate: z.string(),
        ssl_key: z.string(),
        domains: z.array(z.object({
            label: z.string(),
            value: z.string()
        })),
    }).refine(
        (data) => {
            if (data.ssl_type === "custom" && (!data.ssl_certificate || !data.ssl_key)) {
                return false;
            }
            return true;
        },
        {
            message: "SSL Certificate is required",
            path: ["ssl_certificate"], // Attach error to ssl_certificate; you can split errors if needed
        }
    )
    .refine(
        (data) => {
            if (data.ssl_type === "custom" && !data.ssl_key) {
                return false;
            }
            return true;
        },
        {
            message: "SSL Key is required.",
            path: ["ssl_key"], // Attach error to ssl_key
        }
    );
export type CreateSslKeyForm = z.infer<typeof formSchema>

interface Props {
    currentRow?: ProxyHostType
    open: boolean
    onOpenChange: (open: boolean) => void
    onCreated?: () => void
}

export function CreateSslKey({ open, onOpenChange, onCreated }: Props) {
    const [sslType, setSslType] = useState<string>("auto")
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const form = useForm<CreateSslKeyForm>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            ssl_type: 'auto',
            domains: [],
            name: '',
            ssl_certificate: '',
            ssl_key: '',
        }
    })

    const onSubmit = (body: CreateSslKeyForm) => {
        setLoading(true)
        createSslKey(body)
            .then((res) => res.data)
            .then(({ error, data }) => {
                if (error) {
                    if (error.path) {
                        form.setError(error.path as 'ssl_key' | 'ssl_certificate' | 'domains' | 'name', { message: error.message })
                    } else {
                        setError(error.message)
                    }
                    setLoading(false)
                } else {
                    if (data.id) {
                        form.reset()
                        onOpenChange(false)
                        if (onCreated) onCreated()
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
                    <DialogTitle>Create new SSL Key</DialogTitle>
                    <DialogDescription>
                        {error && <p className='text-red-500'>{error}</p>}
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form
                        id='ssl-form'
                        onSubmit={form.handleSubmit(onSubmit)}
                        className='space-y-2 p-0.5'
                    >

                        <FormField
                            control={form.control}
                            name='name'
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className='col-span-2 text-right'>
                                        SSL Name
                                    </FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder='Enter SSL Name'
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage className='col-span-4 col-start-3' />
                                </FormItem>
                            )}
                        />
                        <Tabs onValueChange={(value) => {
                            form.setValue("ssl_type", value)
                            setSslType(value)
                        }} defaultValue="auto" className='text-center'>
                            <TabsList className="grid w-full grid-cols-3">
                                <TabsTrigger value="auto">Auto Generator</TabsTrigger>
                                <TabsTrigger value="le">Let's Encrypt</TabsTrigger>
                                <TabsTrigger value="custom">Custom</TabsTrigger>
                            </TabsList>
                            <TabsContent value="auto" className='text-left'>
                                <br />
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
                                <br />
                                <Button className='pt-2' type='submit' form='ssl-form' disabled={loading}>Generate Now</Button>
                            </TabsContent>
                            <TabsContent value="le" className='text-left'>
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
                            </TabsContent>
                            <TabsContent value="custom" className='text-left'>
                                <FormField
                                    control={form.control}
                                    name='ssl_certificate'
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className='col-span-2 text-right'>
                                                SSL Certificate
                                            </FormLabel>
                                            <FormControl>
                                                <Textarea
                                                    style={{ minHeight: '100px' }}
                                                    placeholder='-----BEGIN CERTIFICATE-----'
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage className='col-span-4 col-start-3' />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name='ssl_key'
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className='col-span-2 text-right'>
                                                SSL Key
                                            </FormLabel>
                                            <FormControl>
                                                <Textarea
                                                    style={{ minHeight: '100px' }}
                                                    placeholder='-----BEGIN PRIVATE KEY-----'
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage className='col-span-4 col-start-3' />
                                        </FormItem>
                                    )}
                                />
                            </TabsContent>
                        </Tabs>
                    </form>
                </Form>
                <DialogFooter>
                    {sslType !== "custom" ? (
                        <>
                        </>
                    ) : (
                        <Button type='submit' form='ssl-form' disabled={loading}>
                            {loading && <Loader2 className="animate-spin" />}Create<IconPlus />
                        </Button>
                    )}
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

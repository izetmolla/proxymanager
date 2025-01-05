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

import { useState } from 'react'
import FormFooter from '@/components/form-footer'
import FormGroup from '@/components/form-group'
import InfoTooltip from '@/features/setup/components/info-tooltip'
import { Input } from '@/components/ui/input'
import { Checkbox } from '@/components/ui/checkbox'
import Select from 'react-select/creatable'
import { GetGeneralNginxConfigTypes, saveGeneralNginxConfig } from '@/services/nginxconfig.service'
import { useToast } from '@/hooks/use-toast'


const formSchema = z
    .object({
        enableNginxIpv6: z.boolean(),
        enableNginxStreams: z.boolean(),
        nginxIpv4Address: z.string().min(1, "Nginx IPv4 Address is required"),
        nginxIpv6Address: z.string().optional(),
        nginxHTTPPort: z.string().min(1, "Nginx HTTP Port is required"),
        nginxHTTPSPort: z.string().min(1, "Nginx HTTPS Port is required"),
    })
export type NginxSettingsForm = z.infer<typeof formSchema>

interface Props {
    settings?: GetGeneralNginxConfigTypes
}

export function NginxSettingsComponentForm({ settings }: Props) {
    const { toast } = useToast()
    const [lloading, setLoading] = useState(false)
    const [ipv4Addresses, setIpv4Addresses] = useState<GetGeneralNginxConfigTypes["ips"]["ipv4"]>(settings?.ips?.ipv4 ?? []);
    const [ipv6Addresses, setIpv6Addresses] = useState<GetGeneralNginxConfigTypes["ips"]["ipv6"]>(settings?.ips?.ipv6 ?? []);
    const form = useForm<NginxSettingsForm>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            enableNginxIpv6: settings?.enableNginxIpv6 ?? false,
            enableNginxStreams: settings?.enableNginxStreams ?? false,
            nginxIpv4Address: settings?.nginxIpv4Address || "0.0.0.0",
            nginxIpv6Address: settings?.nginxIpv6Address || "::",
            nginxHTTPPort: settings?.nginxHTTPPort || "80",
            nginxHTTPSPort: settings?.nginxHTTPSPort || "443",
        }
    })

    const onSubmit = (body: NginxSettingsForm) => {
        setLoading(true)
        saveGeneralNginxConfig(body).then(res => res.data).then(({ error }) => {
            if (error) {
                if (error.path) {
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    form.setError(error.path as any, {
                        message: error?.message
                    })
                } else {
                    toast({
                        title: "Error",
                        description: error?.message,
                        variant: "destructive"
                    })
                }
            } else {
                toast({
                    title: "Success",
                    description: "Nginx settings saved successfully",
                })
            }
            setLoading(false)
        }).catch(err => {
            toast({
                title: "Error",
                description: err?.meessage,
                variant: "destructive"
            })
            setLoading(false)
        })
    }


    return (
        <div className="flex flex-grow flex-col px-0 pb-6 pt-2 md:px-0 lg:px-6 lg:pb-8 3xl:px-0 3xl:pt-4 4xl:px-0 4xl:pb-9">
            <Form {...form}>
                <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="@container"
                >
                    <div className="mb-10 mt-2 grid gap-7 divide-y divide-dashed divide-gray-200 @2xl:gap-9 @3xl:gap-11 z-11">
                        <FormGroup
                            title="Nginx Ip Address"
                            description="Config your nginx ip address here"
                        >
                            <div className='col-span-full space-y-4'>
                                <div className='grid grid-cols-[1fr_100px_100px] gap-2'>
                                    <FormField
                                        control={form.control}
                                        name="nginxIpv4Address"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>
                                                    Listen IPV4 Address
                                                    <span className="text-red-500 ml-1">*</span>
                                                    <InfoTooltip content="Enter 192.168..." />
                                                </FormLabel>
                                                <div className='z-11'>
                                                    <Select
                                                        {...field}
                                                        value={ipv4Addresses?.find(({ value }) => value === field.value)}
                                                        options={ipv4Addresses}
                                                        onCreateOption={(inputValue) => {
                                                            setIpv4Addresses([...ipv4Addresses, { value: inputValue, label: inputValue }]);
                                                            form.setValue('nginxIpv4Address', inputValue);
                                                        }}
                                                        onChange={(selectedOption) => {
                                                            if (selectedOption?.value) {
                                                                form.setValue('nginxIpv4Address', selectedOption.value);
                                                            }
                                                        }}
                                                        defaultValue={ipv4Addresses?.find(({ value }) => value === field.value)}
                                                    />
                                                </div>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="nginxHTTPPort"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Http Port
                                                    <span className="text-red-500 ml-1">*</span>
                                                </FormLabel>
                                                <FormControl>
                                                    <Input placeholder="80" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="nginxHTTPSPort"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Https Port
                                                    <span className="text-red-500 ml-1">*</span>
                                                </FormLabel>
                                                <FormControl>
                                                    <Input placeholder="443" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>

                                <FormField
                                    control={form.control}
                                    name="enableNginxIpv6"
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
                                                    Enable Ipv6 for nginx server.
                                                </FormLabel>
                                            </div>
                                        </FormItem>
                                    )}
                                />

                                {form.watch('enableNginxIpv6') && (
                                    <div>
                                        <FormField
                                            control={form.control}
                                            name="nginxIpv6Address"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>
                                                        Listen IPV6 Address
                                                        <span className="text-red-500 ml-1">*</span>
                                                        <InfoTooltip content="::00..." />
                                                    </FormLabel>
                                                    <div className='z-11'>
                                                        <Select
                                                            {...field}
                                                            value={ipv6Addresses?.find(({ value }) => value === field.value)}
                                                            options={ipv6Addresses}
                                                            onCreateOption={(inputValue) => {
                                                                setIpv6Addresses([...ipv6Addresses, { value: inputValue, label: inputValue }]);
                                                                form.setValue('nginxIpv6Address', inputValue);
                                                            }}
                                                            onChange={(selectedOption) => {
                                                                if (selectedOption?.value) {
                                                                    form.setValue('nginxIpv6Address', selectedOption.value);
                                                                }
                                                            }}
                                                            defaultValue={ipv6Addresses?.find(({ value }) => value === field.value)}

                                                        />
                                                    </div>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>
                                )}
                            </div>
                        </FormGroup>
                        <FormGroup
                            title="Streams"
                            description="Config your default streams options here"
                        >
                            <FormField
                                control={form.control}
                                name="enableNginxStreams"
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
                                                Enable Streams for nginx server.
                                            </FormLabel>
                                        </div>
                                    </FormItem>
                                )}
                            />
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

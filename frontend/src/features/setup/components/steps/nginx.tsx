import { Checkbox } from "@/components/ui/checkbox";
import {
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useFormContext } from "react-hook-form";
import InfoTooltip from "../info-tooltip";
import Select from "react-select/creatable";
import { FC, useState } from "react";
import { GetSetupDataResponse } from "@/services/setup.service";


interface NginxStepProps {
    groupedIps?: GetSetupDataResponse['groupedIps']
}
export const NginxStep: FC<NginxStepProps> = ({ groupedIps }) => {
    const form = useFormContext();
    const [ipv4Addresses, setIpv4Addresses] = useState<GetSetupDataResponse['groupedIps']["ipv4"]>(groupedIps?.ipv4 ?? []);
    const [ipv6Addresses, setIpv6Addresses] = useState<GetSetupDataResponse['groupedIps']["ipv6"]>(groupedIps?.ipv6 ?? []);

    return (
        <div className="space-y-4">
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
                            <Select
                                {...field}
                                value={ipv4Addresses?.find(({ value }) => value === field.value)}
                                options={ipv4Addresses}
                                onCreateOption={(inputValue) => {
                                    setIpv4Addresses([...ipv4Addresses, { value: inputValue, label: inputValue }]);
                                    form.setValue('nginxIpv4Address', inputValue);
                                }}
                                onChange={(selectedOption) => {
                                    form.setValue('nginxIpv4Address', selectedOption?.value);
                                }}
                                defaultValue={ipv4Addresses?.find(({ value }) => value === field.value)}
                            />
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
                                <Select
                                    {...field}
                                    value={ipv6Addresses?.find(({ value }) => value === field.value)}
                                    options={ipv6Addresses}
                                    onCreateOption={(inputValue) => {
                                        setIpv6Addresses([...ipv6Addresses, { value: inputValue, label: inputValue }]);
                                        form.setValue('nginxIpv6Address', inputValue);
                                    }}
                                    onChange={(selectedOption) => {
                                        form.setValue('nginxIpv6Address', selectedOption?.value);
                                    }}
                                    defaultValue={ipv6Addresses?.find(({ value }) => value === field.value)}

                                />
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>
            )}

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

        </div>
    );
}
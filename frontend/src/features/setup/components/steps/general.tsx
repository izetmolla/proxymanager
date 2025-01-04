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
import { FC, useState } from "react";
import { CreateRequestTypes } from "@/types";
import { GetSetupDataResponse } from "@/services/setup.service";
import Select from "react-select/creatable";

interface GeneralStepProps {
    data?: CreateRequestTypes<GetSetupDataResponse>
}
export const GeneralStep: FC<GeneralStepProps> = ({
    data
}) => {
    const form = useFormContext();
    const [ipAddresses, setIpAddresses] = useState<{ label: string, value: string }[]>(data?.data.ips ?? [{ value: "0.0.0.0", label: "0.0.0.0" }]);
    return (
        <div className="space-y-4">
            <FormField
                control={form.control}
                name="baseUrl"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Base URL
                        <span className="text-red-500 ml-1">*</span>
                        <InfoTooltip content="Enter Bas url to access this panel without ports" />
                        </FormLabel>
                        <FormControl>
                            <Input placeholder="yourdomain.com" {...field} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />
            <div className='grid grid-cols-[1fr_100px] gap-2'>
                <FormField
                    control={form.control}
                    name="address"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>
                                Listen Address
                                <span className="text-red-500 ml-1">*</span>
                                <InfoTooltip content="Enter Your listen address" />
                            </FormLabel>
                            <Select
                                {...field}
                                value={ipAddresses?.find(({ value }) => value === field.value)}
                                options={ipAddresses}
                                onCreateOption={(inputValue) => {
                                    console.log(inputValue);
                                    setIpAddresses([...ipAddresses, { value: inputValue, label: inputValue }]);
                                    form.setValue('address', inputValue);
                                }}
                                onChange={(selectedOption) => {
                                    form.setValue('address', selectedOption?.value);
                                }}
                                defaultValue={ipAddresses}
                            />
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="port"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Port
                                <span className="text-red-500 ml-1">*</span>
                                <InfoTooltip content="Enter Port" />
                            </FormLabel>
                            <FormControl>
                                <Input placeholder="81" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
            </div>
        </div>
    )
}
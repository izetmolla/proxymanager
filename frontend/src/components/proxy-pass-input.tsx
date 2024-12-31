import { FC } from 'react';
import { Input } from './ui/input';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from './ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Control } from 'react-hook-form';

interface ProxyPassInputProps {
    hostProps: React.ComponentProps<typeof Input>
    protocolProps: React.ComponentProps<typeof Select>
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    control: Control<any>
}
const ProxyPassInput: FC<ProxyPassInputProps> = ({ hostProps, protocolProps, control, }) => {
    return (
        <div className='grid grid-cols-[100px_1fr] gap-2'>
            <div className='w-[100px]'>
                <FormField
                    control={control}
                    name="protocol"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Protocol</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}{...protocolProps}>
                                <FormControl>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Protocol" />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    <SelectItem value="http">http://</SelectItem>
                                    <SelectItem value="https">https://</SelectItem>
                                </SelectContent>
                            </Select>
                            <FormMessage />
                        </FormItem>
                    )}
                />
            </div>
            <div>
                <FormField
                    control={control}
                    name='host'
                    render={({ field }) => (
                        <FormItem
                        // className='grid grid-cols-6 items-center gap-x-4 gap-y-1 space-y-0'
                        >
                            <FormLabel className='col-span-2 text-right'>
                                Host
                            </FormLabel>
                            <FormControl>
                                <Input
                                    placeholder='localhost:3000'
                                    {...hostProps}
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage className='col-span-4 col-start-3' />
                        </FormItem>
                    )}
                />
            </div>
        </div>
    )
}

export default ProxyPassInput;
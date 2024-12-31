import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from '@/hooks/use-toast'
import { Button } from '@/components/ui/button'
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
// import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import {
    Sheet,
    SheetClose,
    SheetContent,
    SheetDescription,
    SheetFooter,
    SheetHeader,
    SheetTitle,
} from '@/components/ui/sheet'
// import { SelectDropdown } from '@/components/select-dropdown'
import { UserType } from '@/types/user'

interface Props {
    open: boolean
    onOpenChange: (open: boolean) => void
    currentRow?: UserType
}

const formSchema = z.object({
    name: z.string().min(1, 'Name is required.'),
    status: z.string().min(1, 'Please select a status.'),
    label: z.string().min(1, 'Please select a label.'),
    priority: z.string().min(1, 'Please choose a priority.'),
})
type CreateUserForm = z.infer<typeof formSchema>

export function CreateUserDrawer({ open, onOpenChange, currentRow }: Props) {
    const isUpdate = !!currentRow

    const form = useForm<CreateUserForm>({
        resolver: zodResolver(formSchema),
        defaultValues: currentRow ?? {
            name: '',
            // status: '',
            // label: '',
            // priority: '',
        },
    })

    const onSubmit = (data: CreateUserForm) => {
        // do something with the form data
        onOpenChange(false)
        form.reset()
        toast({
            title: 'You submitted the following values:',
            description: (
                <pre className='mt-2 w-[340px] rounded-md bg-slate-950 p-4'>
                    <code className='text-white'>{JSON.stringify(data, null, 2)}</code>
                </pre>
            ),
        })
    }

    return (
        <Sheet
            open={open}
            onOpenChange={(v) => {
                onOpenChange(v)
                form.reset()
            }}
        >
            <SheetContent className='flex flex-col'>
                <SheetHeader className='text-left'>
                    <SheetTitle>{isUpdate ? 'Update' : 'Create'} User</SheetTitle>
                    <SheetDescription>
                        {isUpdate
                            ? 'Update the user by providing necessary info.'
                            : 'Add a new user by providing necessary info.'}
                        Click save when you&apos;re done.
                    </SheetDescription>
                </SheetHeader>
                <Form {...form}>
                    <form
                        id='users-form'
                        onSubmit={form.handleSubmit(onSubmit)}
                        className='space-y-5 flex-1'
                    >
                        <FormField
                            control={form.control}
                            name='name'
                            render={({ field }) => (
                                <FormItem className='space-y-1'>
                                    <FormLabel>Name</FormLabel>
                                    <FormControl>
                                        <Input {...field} placeholder='Enter a Name' />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        {/* <FormField
                            control={form.control}
                            name='status'
                            render={({ field }) => (
                                <FormItem className='space-y-1'>
                                    <FormLabel>Status</FormLabel>
                                    <SelectDropdown
                                        defaultValue={field.value}
                                        onValueChange={field.onChange}
                                        placeholder='Select dropdown'
                                        items={[
                                            { label: 'In Progress', value: 'in progress' },
                                            { label: 'Backlog', value: 'backlog' },
                                            { label: 'Todo', value: 'todo' },
                                            { label: 'Canceled', value: 'canceled' },
                                            { label: 'Done', value: 'done' },
                                        ]}
                                    />
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name='label'
                            render={({ field }) => (
                                <FormItem className='space-y-3 relative'>
                                    <FormLabel>Label</FormLabel>
                                    <FormControl>
                                        <RadioGroup
                                            onValueChange={field.onChange}
                                            defaultValue={field.value}
                                            className='flex flex-col space-y-1'
                                        >
                                            <FormItem className='flex items-center space-x-3 space-y-0'>
                                                <FormControl>
                                                    <RadioGroupItem value='documentation' />
                                                </FormControl>
                                                <FormLabel className='font-normal'>
                                                    Documentation
                                                </FormLabel>
                                            </FormItem>
                                            <FormItem className='flex items-center space-x-3 space-y-0'>
                                                <FormControl>
                                                    <RadioGroupItem value='feature' />
                                                </FormControl>
                                                <FormLabel className='font-normal'>Feature</FormLabel>
                                            </FormItem>
                                            <FormItem className='flex items-center space-x-3 space-y-0'>
                                                <FormControl>
                                                    <RadioGroupItem value='bug' />
                                                </FormControl>
                                                <FormLabel className='font-normal'>Bug</FormLabel>
                                            </FormItem>
                                        </RadioGroup>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name='priority'
                            render={({ field }) => (
                                <FormItem className='space-y-3 relative'>
                                    <FormLabel>Priority</FormLabel>
                                    <FormControl>
                                        <RadioGroup
                                            onValueChange={field.onChange}
                                            defaultValue={field.value}
                                            className='flex flex-col space-y-1'
                                        >
                                            <FormItem className='flex items-center space-x-3 space-y-0'>
                                                <FormControl>
                                                    <RadioGroupItem value='high' />
                                                </FormControl>
                                                <FormLabel className='font-normal'>High</FormLabel>
                                            </FormItem>
                                            <FormItem className='flex items-center space-x-3 space-y-0'>
                                                <FormControl>
                                                    <RadioGroupItem value='medium' />
                                                </FormControl>
                                                <FormLabel className='font-normal'>Medium</FormLabel>
                                            </FormItem>
                                            <FormItem className='flex items-center space-x-3 space-y-0'>
                                                <FormControl>
                                                    <RadioGroupItem value='low' />
                                                </FormControl>
                                                <FormLabel className='font-normal'>Low</FormLabel>
                                            </FormItem>
                                        </RadioGroup>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        /> */}
                    </form>
                </Form>
                <SheetFooter className='gap-2'>
                    <SheetClose asChild>
                        <Button variant='outline'>Close</Button>
                    </SheetClose>
                    <Button form='users-form' type='submit'>
                        Save changes
                    </Button>
                </SheetFooter>
            </SheetContent>
        </Sheet>
    )
}
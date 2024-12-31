import { HTMLAttributes, useState } from 'react'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Link, useRouter } from '@tanstack/react-router'
import { IconBrandGithub, IconBrandGoogle } from '@tabler/icons-react'
import { cn } from '@/lib/utils'
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
import { PasswordInput } from '@/components/password-input'
import { apiSignIn } from '@/services/auth.servoce'
import { useToast } from '@/hooks/use-toast'
import { signIn, useAppDispatch } from '@/store'


type UserAuthFormProps = HTMLAttributes<HTMLDivElement>

const formSchema = z.object({
    username: z
        .string()
        .min(1, { message: 'Please enter your email or Username' }),
    password: z
        .string()
        .min(1, {
            message: 'Please enter your password',
        })
        .min(4, {
            message: 'Password must be at least 4 characters long',
        })
})

export type SignInFormValues = z.infer<typeof formSchema>

export function UserAuthForm({ className, ...props }: UserAuthFormProps) {
    const dispatch = useAppDispatch()
    const { toast } = useToast()
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false)



    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            username: '',
            password: '',
        },
    })


    function onSubmit(body: SignInFormValues) {
        setIsLoading(true)
        apiSignIn(body).then(({ data }) => {
            setIsLoading(false)
            if (data?.error) {
                if (data.error?.path === 'password') {
                    form.setError('password', { message: data.error.message })
                } else {
                    form.setError('username', { message: data.error.message })
                }
            } else {
                dispatch(signIn(data))
                router.invalidate()
            }
        }).catch((error) => {
            setIsLoading(false)
            toast({
                variant: 'destructive',
                title: `Internal Server Error: ! ${error?.message}`,
            })
        })
    }

    return (
        <div className={cn('grid gap-6', className)} {...props}>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)}>
                    <div className='grid gap-2'>
                        <FormField
                            control={form.control}
                            name='username'
                            render={({ field }) => (
                                <FormItem className='space-y-1'>
                                    <FormLabel>Email/Username</FormLabel>
                                    <FormControl>
                                        <Input placeholder='name@example.com' {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name='password'
                            render={({ field }) => (
                                <FormItem className='space-y-1'>
                                    <div className='flex items-center justify-between'>
                                        <FormLabel>Password</FormLabel>
                                        <Link
                                            to='/forgot-password'
                                            className='text-sm font-medium text-muted-foreground hover:opacity-75'
                                        >
                                            Forgot password?
                                        </Link>
                                    </div>
                                    <FormControl>
                                        <PasswordInput placeholder='********' {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button className='mt-2' disabled={isLoading}>
                            Login
                        </Button>

                        <div className='relative my-2'>
                            <div className='absolute inset-0 flex items-center'>
                                <span className='w-full border-t' />
                            </div>
                            <div className='relative flex justify-center text-xs uppercase'>
                                <span className='bg-background px-2 text-muted-foreground'>
                                    Or continue with
                                </span>
                            </div>
                        </div>

                        <div className='flex items-center gap-2'>
                            <Button
                                variant='outline'
                                className='w-full'
                                type='button'
                                disabled={isLoading}
                            >
                                <IconBrandGithub className='h-4 w-4' /> GitHub
                            </Button>
                            <Button
                                variant='outline'
                                className='w-full'
                                type='button'
                                disabled={isLoading}
                            >
                                <IconBrandGoogle className='h-4 w-4' /> Google
                            </Button>
                        </div>
                    </div>
                </form>
            </Form>
        </div>
    )
}

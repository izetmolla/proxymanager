import {
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { useFormContext } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";


export const SecretsStep = () => {
    const form = useFormContext();

    return (
        <div>
            <div className='grid grid-cols-[1fr_120px] gap-2'>
                <FormField
                    control={form.control}
                    name="access_token_secret"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Access Token Secret
                                <span className="text-red-500 ml-1">*</span>
                            </FormLabel>
                            <FormControl>
                                <Input placeholder="Access Token Secret" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="access_token_exp"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Token Expiration
                                <span className="text-red-500 ml-1">*</span>
                            </FormLabel>
                            <FormControl>
                                <Input placeholder="Access Token Expiration" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
            </div>
            <div className='grid grid-cols-[1fr_120px] gap-2 pt-5'>
                <FormField
                    control={form.control}
                    name="refresh_token_secret"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Refresh Token Secret
                                <span className="text-red-500 ml-1">*</span>
                            </FormLabel>
                            <FormControl>
                                <Input placeholder="Refresh Token Secret" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="refresh_token_exp"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Token Expiration
                                <span className="text-red-500 ml-1">*</span>
                            </FormLabel>
                            <FormControl>
                                <Input placeholder="Expiration" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
            </div>

            <div className="pt-5">
                <FormField
                    control={form.control}
                    name="enable_social_auth"
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
                                    This feature will enable social authentication using Google and Github
                                </FormLabel>
                            </div>
                        </FormItem>
                    )}
                />
                {form.watch('enable_social_auth') && (
                    <div className="col-span-full">
                        <div className="pt-5">
                            <div className="col-span-full flex items-center justify-between">
                                <span className="text-md font-semibold text-center">Google Auth Configurations</span>
                            </div>
                            <hr className="pt-2" />
                            <div className='grid grid-cols-1 md:grid-cols-2 gap-2'>
                                <FormField
                                    control={form.control}
                                    name="google_key"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Google Key
                                                <span className="text-red-500 ml-1">*</span>
                                            </FormLabel>
                                            <FormControl>
                                                <Input placeholder="Google Key" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="google_secret"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Google Secret
                                                <span className="text-red-500 ml-1">*</span>
                                            </FormLabel>
                                            <FormControl>
                                                <Input placeholder="Google Secret" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                            <FormField
                                control={form.control}
                                name="google_callback"
                                render={({ field }) => (
                                    <FormItem className="pt-3">
                                        <FormLabel>Google Callback
                                            <span className="text-red-500 ml-1">*</span>
                                        </FormLabel>
                                        <FormControl>
                                            <Input placeholder="Google Callback" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <div className="pt-5">
                            <div className="col-span-full flex items-center justify-between">
                                <span className="text-md font-semibold text-center">Githhub Auth Configurations</span>
                            </div>
                            <hr className="pt-3" />
                            <div className='grid grid-cols-1 md:grid-cols-2 gap-2'>
                                <FormField
                                    control={form.control}
                                    name="github_key"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Github Key
                                                <span className="text-red-500 ml-1">*</span>
                                            </FormLabel>
                                            <FormControl>
                                                <Input placeholder="Github Key" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="github_secret"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Github Secret
                                                <span className="text-red-500 ml-1">*</span>
                                            </FormLabel>
                                            <FormControl>
                                                <Input placeholder="Github Secret" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                            <FormField
                            
                                control={form.control}
                                name="github_callback"
                                render={({ field }) => (
                                    <FormItem className="pt-3">
                                        <FormLabel>Github Callback
                                            <span className="text-red-500 ml-1">*</span>
                                        </FormLabel>
                                        <FormControl>
                                            <Input placeholder="Github Callback" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
import { FC, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import { GeneralStep } from "./steps/general";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { ChevronLeft, ChevronRight, Check } from "lucide-react";
import { GetSetupDataResponse, saveSetupData } from "@/services/setup.service";
import { CreateRequestTypes } from "@/types";
import { SecretsStep } from "./steps/secrets";
import { CreateUserStep } from "./steps/user";
import { signIn, useAppDispatch } from "@/store";
import { setSetup } from "@/store/slices/generalSlice";
import { useRouter } from "@tanstack/react-router";


const generalSchema = z.object({
    baseUrl: z.string().min(1, "Base URL is required"),
    address: z.string().min(1, "Address is required"),
    port: z.string().min(1, "Street address must be at least 5 characters"),
});

const authenticationSchema = z.object({
    access_token_secret: z.string().min(1, "Access Token Secret is required"),
    refresh_token_secret: z.string().min(1, "Refresh Token Secret is required"),
    access_token_exp: z.string().regex(/^\d+[smh]$/, "Refresh Token Expiry must be a number followed by 's', 'm', or 'h'"),
    refresh_token_exp: z.string().regex(/^\d+[smh]$/, "Refresh Token Expiry must be a number followed by 's', 'm', or 'h'"),
    tokens_issuer: z.string().min(1, "Tokens Issuer is required"),
    enable_social_auth: z.boolean(),
    google_key: z.string().optional(),
    google_secret: z.string().optional(),
    google_callback: z.string().optional(),
    github_key: z.string().optional(),
    github_secret: z.string().optional(),
    github_callback: z.string().optional(),
});

const userSchema = z.object({
    email: z.string().email("Invalid email address"),
    username: z.string().min(1, "Username is required"),
    password: z.string().min(1, "Password is required"),
    name: z.string().min(1, "Name is required"),
});


// eslint-disable-next-line
const stepSchemas: { [key: number]: z.ZodObject<any, any, any> } = {
    0: generalSchema,
    1: authenticationSchema,
    2: userSchema,
};




export type StepsFormData = z.infer<typeof generalSchema> | z.infer<typeof authenticationSchema> | z.infer<typeof userSchema>

const STEPS = ["General", "Auth Secrets", "Create User"];


interface SetupStepsFormProps {
    data?: CreateRequestTypes<GetSetupDataResponse>
}
export const SetupStepsForm: FC<SetupStepsFormProps> = ({ data }) => {
    const router = useRouter();
    const dispatch = useAppDispatch();
    const server = data?.data?.server;
    const [step, setStep] = useState(server?.step ?? 0);
    const { toast } = useToast();

    const form = useForm<StepsFormData>({
        resolver: zodResolver(stepSchemas[step]),
        defaultValues: {
            address: server?.address ?? "0.0.0.0",
            port: server?.port.toString() ?? "81",
            baseUrl: server?.baseUrl || "http://project.local",
            access_token_secret: server?.access_token_secret || "",
            refresh_token_secret: server?.refresh_token_secret || "",
            access_token_exp: server?.access_token_exp || "1m",
            refresh_token_exp: server?.refresh_token_exp || "8760h",
            tokens_issuer: server?.tokens_issuer || "",
            enable_social_auth: server?.enable_social_auth || false,
            google_key: server?.google_key || "",
            google_secret: server?.google_secret || "",
            google_callback: server?.google_callback || `${server?.baseUrl}/auth/google/callback`,
            github_key: server?.github_key || "",
            github_secret: server?.github_secret || "",
            github_callback: server?.github_callback || `${server?.baseUrl}/auth/github/callback`,
            email: "",
            username: "",
            password: "",
            name: "",
        },
    })

    const onSubmit = (data: StepsFormData) => {
        saveSetupData(data, step).then((res) => res.data).then(({ error, data: { server, user, tokens } }) => {
            if (error) {
                if (error.path) {
                    // eslint-disable-next-line
                    form.setError(error.path as any, {
                        message: error.message
                    })
                } else {
                    toast({
                        title: "Error",
                        description: error.message,
                        variant: "destructive"
                    });
                }
            } else {
                if (step === STEPS.length - 1) {
                    toast({
                        title: "Success",
                        description: "Setup completed successfully",
                    });
                    dispatch(signIn({ user, tokens }));
                    dispatch(setSetup(true))
                    router.invalidate()
                } else {
                    setStep(server.step);
                    if (server.step === 1) {
                        form.reset({
                            ...form.getValues(),
                            google_callback: `${server?.baseUrl}/auth/google/callback`,
                            github_callback: `${server?.baseUrl}/auth/github/callback`,
                        })
                    }
                }
            }
        }).catch(e => {
            console.log(e)
            toast({
                title: "Error",
                description: e?.message,
                variant: "destructive"
            });
        })
    };

    const progress = ((step + 1) / STEPS.length) * 100;


    console.log(form.formState.errors)
    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted p-4">
            <Card className="w-full max-w-2xl">
                <CardHeader>
                    <CardTitle className="text-2xl font-bold text-center">
                        {STEPS[step]}
                    </CardTitle>
                    <Progress value={progress} className="h-2" />
                </CardHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)}>
                        <CardContent className="space-y-4">
                            {step === 0 && <GeneralStep data={data} />}
                            {step === 1 && <SecretsStep />}
                            {step === 2 && <CreateUserStep />}
                        </CardContent>
                        <CardFooter className="flex justify-between">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => setStep((s) => s - 1)}
                                disabled={step === 0}
                            >
                                <ChevronLeft className="mr-2 h-4 w-4" />
                                Previous
                            </Button>
                            {step === STEPS.length - 1 ? (
                                <Button type="submit">
                                    Finish Setup
                                    <Check className="ml-2 h-4 w-4" />
                                </Button>
                            ) : (
                                <Button type="submit">
                                    Next
                                    <ChevronRight className="ml-2 h-4 w-4" />
                                </Button>
                            )}
                        </CardFooter>
                    </form>
                </Form>
            </Card>
        </div>
    );
}
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
import { ChevronLeft, ChevronRight, Check, Loader2 } from "lucide-react";
import { applySetupData, createFirstUser, GetSetupDataResponse, saveSetupData } from "@/services/setup.service";
import { CreateRequestTypes } from "@/types";
import { SecretsStep } from "./steps/secrets";
import { CreateUserStep } from "./steps/user";
import { signIn, useAppDispatch } from "@/store";
import { setFirstUser, setSetup } from "@/store/slices/generalSlice";
import { useRouter } from "@tanstack/react-router";
import { NginxStep } from "./steps/nginx";
import { ApplyStep } from "./steps/apply";
import axios from "axios";




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

const nginxSchema = z.object({
    enableNginxIpv6: z.boolean(),
    enableNginxStreams: z.boolean(),
    nginxIpv4Address: z.string().min(1, "Nginx IPv4 Address is required"),
    nginxIpv6Address: z.string().optional(),
    nginxHTTPPort: z.string().min(1, "Nginx HTTP Port is required"),
    nginxHTTPSPort: z.string().min(1, "Nginx HTTPS Port is required"),
});

const applySchema = z.object({

});


const userSchema = z.object({
    email: z.string().email("Invalid email address"),
    username: z.string().min(1, "Username is required"),
    password: z.string().min(1, "Password is required"),
    name: z.string().min(1, "Name is required"),
});


// eslint-disable-next-line
const stepSchemas: { [key: number]: z.ZodObject<any, any, any, any, any> } = {
    0: generalSchema,
    1: authenticationSchema,
    2: nginxSchema,
    3: applySchema,
    4: userSchema,
};




export type StepsFormData = z.infer<typeof generalSchema> | z.infer<typeof authenticationSchema> | z.infer<typeof nginxSchema> | z.infer<typeof applySchema> | z.infer<typeof userSchema>

const STEPS = ["General Config", "Auth Secrets Config", "Nginx Config", "Apply Configs", "Create User"];


interface SetupStepsFormProps {
    data?: CreateRequestTypes<GetSetupDataResponse>
}
export const SetupStepsForm: FC<SetupStepsFormProps> = ({ data }) => {
    const router = useRouter();
    const dispatch = useAppDispatch();
    const server = data?.data?.server;
    const ips = data?.data?.ips ?? [];
    const [step, setStep] = useState(server?.step ?? data?.data?.step ?? 0);
    const [loadingApply, setLoadingApply] = useState(false);
    const [checkingIp, setCheckingIp] = useState("");
    const { toast } = useToast();

    const form = useForm<StepsFormData>({
        resolver: zodResolver(stepSchemas[step]),
        defaultValues: {
            address: server?.address ?? "0.0.0.0",
            port: server?.port.toString() ?? "81",
            baseUrl: server?.baseUrl || "http://proxymanager.local",
            access_token_secret: server?.access_token_secret || "",
            refresh_token_secret: server?.refresh_token_secret || "",
            access_token_exp: server?.access_token_exp || "1m",
            refresh_token_exp: server?.refresh_token_exp || "8760h",
            tokens_issuer: server?.tokens_issuer || "",
            enable_social_auth: server?.enable_social_auth || false,
            google_key: server?.google_key || "",
            google_secret: server?.google_secret || "",
            google_callback: server?.google_callback || "/auth/google/callback",
            github_key: server?.github_key || "",
            github_secret: server?.github_secret || "",
            github_callback: server?.github_callback || "/auth/github/callback",

            enableNginxIpv6: server?.enableNginxIpv6 ?? false,
            enableNginxStreams: server?.enableNginxStreams ?? false,
            nginxIpv4Address: server?.nginxIpv4Address || "0.0.0.0",
            nginxIpv6Address: server?.nginxIpv6Address || "::",
            nginxHTTPPort: server?.nginxHTTPPort || "80",
            nginxHTTPSPort: server?.nginxHTTPSPort || "443",

            email: "",
            username: "",
            password: "",
            name: "",
        },
    })

    const onSubmit = (data: StepsFormData) => {
        if (step == 4) {
            createFirstUser(data).then((res) => res.data).then(({ error, data }) => {
                if (error) {
                    if (error.path) {
                        // eslint-disable-next-line
                        form.setError(error.path as any, {
                            message: error.message
                        })
                    } else {
                        toast({
                            title: "Error",
                            description: error?.message,
                            variant: "destructive"
                        });
                    }
                } else {
                    toast({
                        title: "Success",
                        description: "User created successfully",
                    });
                    dispatch(signIn({ user: data.user, tokens: data.tokens }));
                    dispatch(setSetup(true))
                    dispatch(setFirstUser(true))
                    router.invalidate()
                }
            }).catch(e => {
                toast({
                    title: "Error",
                    description: e?.message,
                    variant: "destructive"
                });
            })
        } else {
            saveSetupData(data, step).then((res) => res.data).then(({ error, data }) => {
                if (error) {
                    if (error.path) {
                        // eslint-disable-next-line
                        form.setError(error.path as any, {
                            message: error.message
                        })
                    } else {
                        toast({
                            title: "Error",
                            description: error?.message,
                            variant: "destructive"
                        });
                    }
                } else {
                    const { server, user, tokens, finished } = data;
                    if (finished) {
                        toast({
                            title: "Success",
                            description: "Setup completed successfully",
                        });
                        dispatch(signIn({ user, tokens }));
                        dispatch(setSetup(true))
                        router.invalidate()
                    } else {
                        setStep(server.step);
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
        }
    };

    const progress = ((step + 1) / STEPS.length) * 100;


    const applyChanges = () => {
        const { port, hostname } = window?.location
        let checking = 0;
        const checkHealthStatus = async (ips: string[], port: string, i: number = 0): Promise<string | null> => {
            ips = ips.filter(x => x !== "0.0.0.0").filter(x => x !== "127.0.0.1").filter(x => x !== "::")
            if (ips.length === 0) {
                return null;
            }
            setCheckingIp("Checking IP: " + ips[i])
            return axios
                .get(`http://${ips[i].includes(":") ? `[${ips[i]}]` : ips[i]}:${port}/health`)
                .then(x => x.data)
                .then((data) => {
                    if (data?.status == "OK") {
                        return `http://${ips[i].includes(":") ? `[${ips[i]}]` : ips[i]}:${port}/setup`
                    }
                    if (i < ips.length - 1) {
                        return checkHealthStatus(ips, port, i + 1)
                    } else {
                        checking++;
                        if (checking > 10) {
                            return null;
                        }
                        return checkHealthStatus(ips, port, 0)
                    }
                }).catch(() => {
                    if (i < ips.length - 1) {
                        return checkHealthStatus(ips, port, i + 1)
                    } else {
                        checking++;
                        console.log("Retrying in 2 seconds")
                        if (checking > 10) {
                            return null;
                        }
                        return checkHealthStatus(ips, port, 0)
                    }
                })
        };



        setLoadingApply(true);
        applySetupData({ ipAddress: hostname ?? "", port: port.toString() ?? "" })
            .then((res) => res.data)
            .then(({ error, data }) => {
                if (error) {
                    toast({
                        title: "Error",
                        description: error?.message,
                        variant: "destructive"
                    });
                } else {
                    if (data?.redirect) {
                        const ipsList = window?.location?.hostname ? [window?.location?.hostname, ...(ips?.map(x => x.value) ?? [])] : []
                        console.log("Checking health status on 2 seconds", ipsList)
                        setCheckingIp("Checking health status on 2 seconds")
                        setTimeout(async () => {
                            const url = await checkHealthStatus(ipsList, form.watch('port'))
                            if (url) {
                                console.log("Redirecting to", url)
                                setCheckingIp("Redirecting to: " + url)
                                window.location.replace(url)
                            } else {
                                setCheckingIp("Failed to get health status url")
                            }
                        }, 2000);
                    }
                    if (data?.server?.step) {
                        setStep(data?.server?.step)
                    }
                    console.log("success", error, data)
                }
                setLoadingApply(false);
            })
            .catch(e => {
                if (e?.message == "Network Error" || e.CODE == "ERR_CONNECTION_REFUSED" || e.status == 500) {
                    const ipsList = window?.location?.hostname ? [window?.location?.hostname, ...(ips?.map(x => x.value) ?? [])] : []
                    console.log("Checking health status on 2 seconds", ipsList)
                    setCheckingIp("Checking health status on 2 seconds")
                    setTimeout(async () => {
                        const url = await checkHealthStatus(ipsList, form.watch('port'))
                        if (url) {
                            console.log("Redirecting to", url)
                            setCheckingIp("Redirecting to: " + url)
                            window.location.replace(url)
                        } else {
                            setCheckingIp("Failed to get health status url")
                        }
                    }, 2000);
                } else {
                    toast({
                        title: "Error",
                        description: e?.message,
                        variant: "destructive"
                    });
                    setCheckingIp("Failed to get health status url")

                }
            })
    }



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
                        {data?.data?.onlyCreateUser ? (
                            <>
                                <CardContent className="space-y-4">
                                    <CreateUserStep />
                                </CardContent>
                                <CardFooter className="flex justify-between items-right">
                                    <Button type="submit">
                                        Create User
                                        <ChevronRight className="ml-2 h-4 w-4" />
                                    </Button>
                                </CardFooter>
                            </>
                        ) : (
                            <>
                                <CardContent className="space-y-4">
                                    {step === 0 && <GeneralStep data={data} />}
                                    {step === 1 && <SecretsStep />}
                                    {step === 2 && <NginxStep groupedIps={data?.data.groupedIps} />}
                                    {step === 3 && <ApplyStep ips={data?.data.ips.map(x => x.value)} defaultAddress={server?.address} defaultPort={server?.port} />}
                                    {step === 4 && <CreateUserStep />}

                                    {step === 3 && (
                                        <>
                                            {checkingIp && (
                                                <>
                                                    <div className="flex flex-row items-center space-x-2">
                                                        <Loader2 className="animate-spin" />
                                                        <span>Checking health status for {checkingIp}</span>
                                                    </div>
                                                </>
                                            )}
                                        </>
                                    )}
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
                                    ) : step == 3 ? (
                                        <Button type="button" onClick={() => applyChanges()} disabled={loadingApply}>
                                            {loadingApply && <Loader2 className="animate-spin" />}  Apply Changes
                                            <ChevronRight className="ml-2 h-4 w-4" />
                                        </Button>
                                    ) : step == 4 ? (
                                        <Button type="submit">
                                            Create User
                                            <ChevronRight className="ml-2 h-4 w-4" />
                                        </Button>
                                    ) : (
                                        <Button type="submit">
                                            Next
                                            <ChevronRight className="ml-2 h-4 w-4" />
                                        </Button>
                                    )}
                                </CardFooter>
                            </>
                        )}
                    </form>
                </Form>
            </Card>
        </div >
    );
}

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import { PersonalInfoStep } from "./steps/user";
import { AddressStep } from "./steps/general";
import { PreferencesStep } from "./steps/security";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { ChevronLeft, ChevronRight, Check } from "lucide-react";
import { initSetupApp } from "@/services/setup.service";
import { useAppDispatch } from "@/store";
import { setSetup } from "@/store/slices/generalSlice";
import { useRouter } from "@tanstack/react-router";


export const personalInfoSchema = z.object({
    firstName: z.string().min(2, "First name must be at least 2 characters"),
    lastName: z.string().min(2, "Last name must be at least 2 characters"),
    email: z.string().email("Invalid email address"),
});

export const addressSchema = z.object({
    street: z.string().min(5, "Street address must be at least 5 characters"),
    city: z.string().min(2, "City must be at least 2 characters"),
    state: z.string().length(2, "Please enter a valid state abbreviation"),
    zipCode: z.string().regex(/^\d{5}$/, "Please enter a valid ZIP code"),
});

export const preferencesSchema = z.object({
    notifications: z.boolean().default(true),
    newsletter: z.boolean().default(false),
    theme: z.enum(["light", "dark", "system"]).default("system"),
});

export const formSchema = z.object({
    personal: personalInfoSchema,
    address: addressSchema,
    preferences: preferencesSchema,
});

type FormData = z.infer<typeof formSchema>;

const STEPS = ["Personal Info", "Address", "Preferences"];

export function SetupStepsForm() {
    const router = useRouter()
    const dispatch = useAppDispatch()
    const [step, setStep] = useState(0);
    const { toast } = useToast();

    const form = useForm<FormData>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            personal: {
                firstName: "",
                lastName: "",
                email: "",
            },
            address: {
                street: "",
                city: "",
                state: "",
                zipCode: "",
            },
            preferences: {
                notifications: true,
                newsletter: false,
                theme: "system",
            },
        },
    });

    const onSubmit = (data: FormData) => {
        toast({
            title: "Success!",
            description: "Form submitted successfully",
        });
        console.log(data);
    };

    const progress = ((step + 1) / STEPS.length) * 100;


    const init = () => {
        initSetupApp({ id: '1' }).then((res) => res.data).then(({ error }) => {
            if (error) {
                console.log(error)
            } else {
                dispatch(setSetup(true))
                router.invalidate()
            }
        }).catch(e => {
            console.log(e)
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
                        <CardContent className="space-y-4">
                            {step === 0 && <PersonalInfoStep />}
                            {step === 1 && <AddressStep />}
                            {step === 2 && <PreferencesStep />}
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
                                <Button type="button" onClick={init}>
                                    Submit
                                    <Check className="ml-2 h-4 w-4" />
                                </Button>
                            ) : (
                                <Button
                                    type="button"
                                    onClick={() => setStep((s) => s + 1)}
                                >
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
import { cn } from "@/lib/utils";

interface FormGroupProps {
    title: React.ReactNode;
    className?: string;
    description?: string;
    children?: React.ReactNode;
}

export default function FormGroup({
    title,
    className,
    description,
    children,
}: FormGroupProps) {
    return (
        <div className={cn('grid grid-cols-1  md:grid-cols-[30%_70%] gap-5 pt-3', className)}>
            <div className="">
                <h4 className="text-base font-medium">{title}</h4>
                {description && <p className="mt-2">{description}</p>}
            </div>
            {children && (
                <div className="grid gap-4 @2xl:grid-cols-2 @4xl:col-span-8 @4xl:gap-5 xl:gap-7">
                    {children}
                </div>
            )}
        </div>
    );
}
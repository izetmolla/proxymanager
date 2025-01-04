import { Fragment, ReactNode } from 'react';
import { Button } from './ui/button';
import { cn } from '@/lib/utils';

interface FormFooterProps {
    className?: string;
    altBtnText?: string;
    submitBtnText?: string;
    isLoading?: boolean;
    handleAltBtn?: () => void;
    hasCancel?: boolean
    otherButton?: ReactNode
    id?: string
}

export const negMargin = '-mx-4 md:-mx-5 lg:-mx-6 3xl:-mx-8 4xl:-mx-10';

export default function FormFooter({
    isLoading,
    altBtnText = 'Save as Draft',
    submitBtnText = 'Submit',
    className,
    handleAltBtn,
    hasCancel = false,
    otherButton,
    id = ""
}: FormFooterProps) {
    return (
        <div
            className={cn(
            'sticky bottom-0 left-0 right-0 z-10 -mb-8 flex items-center justify-end gap-4 border-t  px-4 py-4 md:px-5 lg:px-6 3xl:px-8 4xl:px-10 bg-white dark:bg-gray-800',
            className,
            negMargin
            )}
        >
            {hasCancel ? <Button
            variant="outline"
            className="w-full @xl:w-auto"
            onClick={handleAltBtn}
            id={id}
            >
            {altBtnText}
            </Button> : <div />}
            {otherButton && <Fragment>{otherButton}</Fragment>}


            <div>
            <Button type="submit" disabled={isLoading} className="w-full @xl:w-min" id={id}>
                {submitBtnText} {isLoading && '...'}
            </Button>
            </div>
        </div>
    );
}
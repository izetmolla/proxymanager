import { FC, Fragment } from "react"

import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"


interface CustomBreadcrumbProps {
    breadcrumb: {
        name: string;
        href?: string;
    }[]
}
export const CustomBreadcrumb: FC<CustomBreadcrumbProps> = ({ breadcrumb }) => {

    return (
        <Breadcrumb>
            <BreadcrumbList>
                {breadcrumb.map((item, index) => (
                    <Fragment key={index}>
                        <BreadcrumbItem>
                            {item.href ? (
                                <BreadcrumbLink href={item.href}>{item.name}</BreadcrumbLink>
                            ) : (
                                <BreadcrumbPage>{item.name}</BreadcrumbPage>
                            )}
                        </BreadcrumbItem>
                        {index < breadcrumb.length - 1 && <BreadcrumbSeparator />}
                    </Fragment>
                ))}
            </BreadcrumbList>
        </Breadcrumb>
    )
}

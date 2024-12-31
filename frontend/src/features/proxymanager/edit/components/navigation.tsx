

import { cn } from "@/lib/utils"
import { Link, useParams } from '@tanstack/react-router'


export function ComponentNavigation() {
    const { id, nav } = useParams({ from: "/_authenticated/proxy-manager/$id/$nav/" })

    const navItems = [
        { nav: "overview", name: "Overview", href: `/proxy-manager/${id}/overview` },
        { nav: "locations", name: "Locations", href: `/proxy-manager/${id}/locations` },
        { nav: "ssl", name: "SSL Keys", href: `/proxy-manager/${id}/ssl` }
    ]

    return (
        <div className="w-full border-b bg-background">
            <div className="overflow-auto">
                <nav className="flex h-16 items-center px-0 md:h-[49px]">
                    {navItems.map((item) => (
                        <Link
                            key={item.name}
                            href={item.href}
                            className={cn(
                                "flex h-full items-center gap-2 border-b-2 border-transparent px-4 pt-1 text-sm font-semibold",
                                nav === item.nav && "border-primary text-primary",
                                nav !== item.nav && "text-muted-foreground hover:border-gray-300 hover:text-foreground"
                            )}
                        >
                            {item.name}
                        </Link>
                    ))}
                </nav>
            </div>
        </div>
    )
}


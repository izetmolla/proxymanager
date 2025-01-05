import Cookies from 'js-cookie'
import { createFileRoute, Outlet, redirect } from '@tanstack/react-router'
import { cn } from '@/lib/utils'
import { SearchProvider } from '@/context/search-context'
import { SidebarProvider } from '@/components/ui/sidebar'
import { AppSidebar } from '@/components/layout/app-sidebar'
import SkipToMain from '@/components/skip-to-main'
import { Header } from '@/components/layout/header'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { ProfileDropdown } from '@/components/profile-dropdown'
import NotFoundError from '@/features/errors/not-found-error'
import GeneralError from '@/features/errors/general-error'

export const Route = createFileRoute('/_authenticated')({
  beforeLoad: ({ context }) => {
    if ((!context?.setup || !context.firstUser) && window.location.pathname !== '/setup') {
      throw redirect({ to: "/setup" });
    }
    if (!context.auth?.signedIn) {
      throw redirect({ to: "/sign-in" });
    }
  },
  component: RouteComponent,
  notFoundComponent: NotFoundError,
  errorComponent: GeneralError,
})

function RouteComponent() {
  const defaultOpen = Cookies.get('sidebar:state') !== 'false'
  return (
    <SearchProvider>
      <SidebarProvider defaultOpen={defaultOpen}>
        <SkipToMain />
        <AppSidebar />
        <div
          id='content'
          className={cn(
            'max-w-full w-full ml-auto',
            'peer-data-[state=collapsed]:w-[calc(100%-var(--sidebar-width-icon))]',
            'peer-data-[state=expanded]:w-[calc(100%-var(--sidebar-width))]',
            'transition-[width] ease-linear duration-200',
            'h-svh flex flex-col'
          )}
        >
          <Header>
            <Search />
            <div className='ml-auto flex items-center space-x-4'>
              <ThemeSwitch />
              <ProfileDropdown />
            </div>
          </Header>
          <Outlet />
        </div>
      </SidebarProvider>
    </SearchProvider>
  )
}




import {
    QueryClient,
    QueryClientProvider,
} from '@tanstack/react-query'
import { RouterProvider, createRouter } from '@tanstack/react-router'
import { ThemeProvider } from './context/theme-context'
import { routeTree } from './routeTree.gen'
import { useAppSelector } from './store';



const queryClient = new QueryClient()

// Create a new router instance
const router = createRouter({
    routeTree,
    context: { queryClient, auth: null },
    defaultPreload: 'intent',
    defaultPreloadStaleTime: 0,
})

// Register the router instance for type safety
declare module '@tanstack/react-router' {
    interface Register {
        router: typeof router
    }
}
function App() {
    const auth = useAppSelector(x => x.auth);

    return (
        <QueryClientProvider client={queryClient}>
            <ThemeProvider defaultTheme='light' storageKey='vite-ui-theme'>
                <RouterProvider router={router} context={{ auth }} />
            </ThemeProvider>
        </QueryClientProvider>
    )
}

export default App;
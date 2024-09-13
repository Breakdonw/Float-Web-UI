import { Toaster } from '@/components/ui/toaster'
import { createRootRoute, Link, Outlet } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/router-devtools'

export const Route = createRootRoute({
  component: () => (
    <>
      <Toaster/>
      <Outlet />
      <TanStackRouterDevtools />
      </>
  ),
})

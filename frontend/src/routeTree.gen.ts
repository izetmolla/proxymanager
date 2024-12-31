/* eslint-disable */

// @ts-nocheck

// noinspection JSUnusedGlobalSymbols

// This file was automatically generated by TanStack Router.
// You should NOT make any changes in this file as it will be overwritten.
// Additionally, you should also exclude this file from your linter and/or formatter to prevent it from being checked or modified.

import { createFileRoute } from '@tanstack/react-router'

// Import Routes

import { Route as rootRoute } from './routes/__root'
import { Route as AuthenticatedRouteImport } from './routes/_authenticated/route'
import { Route as AuthenticatedIndexImport } from './routes/_authenticated/index'
import { Route as authSignInImport } from './routes/(auth)/sign-in'
import { Route as authForgotPasswordImport } from './routes/(auth)/forgot-password'
import { Route as auth500Import } from './routes/(auth)/500'
import { Route as AuthenticatedProxyManagerIdNavIndexImport } from './routes/_authenticated/proxy-manager/$id/$nav/index'

// Create Virtual Routes

const AuthenticatedUsersIndexLazyImport = createFileRoute(
  '/_authenticated/users/',
)()
const AuthenticatedUptimeIndexLazyImport = createFileRoute(
  '/_authenticated/uptime/',
)()
const AuthenticatedUpstreamsIndexLazyImport = createFileRoute(
  '/_authenticated/upstreams/',
)()
const AuthenticatedSslManagerIndexLazyImport = createFileRoute(
  '/_authenticated/ssl-manager/',
)()
const AuthenticatedProxyManagerIndexLazyImport = createFileRoute(
  '/_authenticated/proxy-manager/',
)()
const AuthenticatedNotificationsSettingsIndexLazyImport = createFileRoute(
  '/_authenticated/notifications-settings/',
)()
const AuthenticatedNginxSettingsIndexLazyImport = createFileRoute(
  '/_authenticated/nginx-settings/',
)()
const AuthenticatedLogsSettingsIndexLazyImport = createFileRoute(
  '/_authenticated/logs-settings/',
)()
const AuthenticatedGeneralSettingsIndexLazyImport = createFileRoute(
  '/_authenticated/general-settings/',
)()
const AuthenticatedApiSettingsIndexLazyImport = createFileRoute(
  '/_authenticated/api-settings/',
)()
const AuthenticatedAccountIndexLazyImport = createFileRoute(
  '/_authenticated/account/',
)()
const AuthenticatedAccessListIndexLazyImport = createFileRoute(
  '/_authenticated/access-list/',
)()

// Create/Update Routes

const AuthenticatedRouteRoute = AuthenticatedRouteImport.update({
  id: '/_authenticated',
  getParentRoute: () => rootRoute,
} as any)

const AuthenticatedIndexRoute = AuthenticatedIndexImport.update({
  id: '/',
  path: '/',
  getParentRoute: () => AuthenticatedRouteRoute,
} as any)

const authSignInRoute = authSignInImport.update({
  id: '/(auth)/sign-in',
  path: '/sign-in',
  getParentRoute: () => rootRoute,
} as any)

const authForgotPasswordRoute = authForgotPasswordImport.update({
  id: '/(auth)/forgot-password',
  path: '/forgot-password',
  getParentRoute: () => rootRoute,
} as any)

const auth500Route = auth500Import.update({
  id: '/(auth)/500',
  path: '/500',
  getParentRoute: () => rootRoute,
} as any)

const AuthenticatedUsersIndexLazyRoute =
  AuthenticatedUsersIndexLazyImport.update({
    id: '/users/',
    path: '/users/',
    getParentRoute: () => AuthenticatedRouteRoute,
  } as any).lazy(() =>
    import('./routes/_authenticated/users/index.lazy').then((d) => d.Route),
  )

const AuthenticatedUptimeIndexLazyRoute =
  AuthenticatedUptimeIndexLazyImport.update({
    id: '/uptime/',
    path: '/uptime/',
    getParentRoute: () => AuthenticatedRouteRoute,
  } as any).lazy(() =>
    import('./routes/_authenticated/uptime/index.lazy').then((d) => d.Route),
  )

const AuthenticatedUpstreamsIndexLazyRoute =
  AuthenticatedUpstreamsIndexLazyImport.update({
    id: '/upstreams/',
    path: '/upstreams/',
    getParentRoute: () => AuthenticatedRouteRoute,
  } as any).lazy(() =>
    import('./routes/_authenticated/upstreams/index.lazy').then((d) => d.Route),
  )

const AuthenticatedSslManagerIndexLazyRoute =
  AuthenticatedSslManagerIndexLazyImport.update({
    id: '/ssl-manager/',
    path: '/ssl-manager/',
    getParentRoute: () => AuthenticatedRouteRoute,
  } as any).lazy(() =>
    import('./routes/_authenticated/ssl-manager/index.lazy').then(
      (d) => d.Route,
    ),
  )

const AuthenticatedProxyManagerIndexLazyRoute =
  AuthenticatedProxyManagerIndexLazyImport.update({
    id: '/proxy-manager/',
    path: '/proxy-manager/',
    getParentRoute: () => AuthenticatedRouteRoute,
  } as any).lazy(() =>
    import('./routes/_authenticated/proxy-manager/index.lazy').then(
      (d) => d.Route,
    ),
  )

const AuthenticatedNotificationsSettingsIndexLazyRoute =
  AuthenticatedNotificationsSettingsIndexLazyImport.update({
    id: '/notifications-settings/',
    path: '/notifications-settings/',
    getParentRoute: () => AuthenticatedRouteRoute,
  } as any).lazy(() =>
    import('./routes/_authenticated/notifications-settings/index.lazy').then(
      (d) => d.Route,
    ),
  )

const AuthenticatedNginxSettingsIndexLazyRoute =
  AuthenticatedNginxSettingsIndexLazyImport.update({
    id: '/nginx-settings/',
    path: '/nginx-settings/',
    getParentRoute: () => AuthenticatedRouteRoute,
  } as any).lazy(() =>
    import('./routes/_authenticated/nginx-settings/index.lazy').then(
      (d) => d.Route,
    ),
  )

const AuthenticatedLogsSettingsIndexLazyRoute =
  AuthenticatedLogsSettingsIndexLazyImport.update({
    id: '/logs-settings/',
    path: '/logs-settings/',
    getParentRoute: () => AuthenticatedRouteRoute,
  } as any).lazy(() =>
    import('./routes/_authenticated/logs-settings/index.lazy').then(
      (d) => d.Route,
    ),
  )

const AuthenticatedGeneralSettingsIndexLazyRoute =
  AuthenticatedGeneralSettingsIndexLazyImport.update({
    id: '/general-settings/',
    path: '/general-settings/',
    getParentRoute: () => AuthenticatedRouteRoute,
  } as any).lazy(() =>
    import('./routes/_authenticated/general-settings/index.lazy').then(
      (d) => d.Route,
    ),
  )

const AuthenticatedApiSettingsIndexLazyRoute =
  AuthenticatedApiSettingsIndexLazyImport.update({
    id: '/api-settings/',
    path: '/api-settings/',
    getParentRoute: () => AuthenticatedRouteRoute,
  } as any).lazy(() =>
    import('./routes/_authenticated/api-settings/index.lazy').then(
      (d) => d.Route,
    ),
  )

const AuthenticatedAccountIndexLazyRoute =
  AuthenticatedAccountIndexLazyImport.update({
    id: '/account/',
    path: '/account/',
    getParentRoute: () => AuthenticatedRouteRoute,
  } as any).lazy(() =>
    import('./routes/_authenticated/account/index.lazy').then((d) => d.Route),
  )

const AuthenticatedAccessListIndexLazyRoute =
  AuthenticatedAccessListIndexLazyImport.update({
    id: '/access-list/',
    path: '/access-list/',
    getParentRoute: () => AuthenticatedRouteRoute,
  } as any).lazy(() =>
    import('./routes/_authenticated/access-list/index.lazy').then(
      (d) => d.Route,
    ),
  )

const AuthenticatedProxyManagerIdNavIndexRoute =
  AuthenticatedProxyManagerIdNavIndexImport.update({
    id: '/proxy-manager/$id/$nav/',
    path: '/proxy-manager/$id/$nav/',
    getParentRoute: () => AuthenticatedRouteRoute,
  } as any)

// Populate the FileRoutesByPath interface

declare module '@tanstack/react-router' {
  interface FileRoutesByPath {
    '/_authenticated': {
      id: '/_authenticated'
      path: ''
      fullPath: ''
      preLoaderRoute: typeof AuthenticatedRouteImport
      parentRoute: typeof rootRoute
    }
    '/(auth)/500': {
      id: '/(auth)/500'
      path: '/500'
      fullPath: '/500'
      preLoaderRoute: typeof auth500Import
      parentRoute: typeof rootRoute
    }
    '/(auth)/forgot-password': {
      id: '/(auth)/forgot-password'
      path: '/forgot-password'
      fullPath: '/forgot-password'
      preLoaderRoute: typeof authForgotPasswordImport
      parentRoute: typeof rootRoute
    }
    '/(auth)/sign-in': {
      id: '/(auth)/sign-in'
      path: '/sign-in'
      fullPath: '/sign-in'
      preLoaderRoute: typeof authSignInImport
      parentRoute: typeof rootRoute
    }
    '/_authenticated/': {
      id: '/_authenticated/'
      path: '/'
      fullPath: '/'
      preLoaderRoute: typeof AuthenticatedIndexImport
      parentRoute: typeof AuthenticatedRouteImport
    }
    '/_authenticated/access-list/': {
      id: '/_authenticated/access-list/'
      path: '/access-list'
      fullPath: '/access-list'
      preLoaderRoute: typeof AuthenticatedAccessListIndexLazyImport
      parentRoute: typeof AuthenticatedRouteImport
    }
    '/_authenticated/account/': {
      id: '/_authenticated/account/'
      path: '/account'
      fullPath: '/account'
      preLoaderRoute: typeof AuthenticatedAccountIndexLazyImport
      parentRoute: typeof AuthenticatedRouteImport
    }
    '/_authenticated/api-settings/': {
      id: '/_authenticated/api-settings/'
      path: '/api-settings'
      fullPath: '/api-settings'
      preLoaderRoute: typeof AuthenticatedApiSettingsIndexLazyImport
      parentRoute: typeof AuthenticatedRouteImport
    }
    '/_authenticated/general-settings/': {
      id: '/_authenticated/general-settings/'
      path: '/general-settings'
      fullPath: '/general-settings'
      preLoaderRoute: typeof AuthenticatedGeneralSettingsIndexLazyImport
      parentRoute: typeof AuthenticatedRouteImport
    }
    '/_authenticated/logs-settings/': {
      id: '/_authenticated/logs-settings/'
      path: '/logs-settings'
      fullPath: '/logs-settings'
      preLoaderRoute: typeof AuthenticatedLogsSettingsIndexLazyImport
      parentRoute: typeof AuthenticatedRouteImport
    }
    '/_authenticated/nginx-settings/': {
      id: '/_authenticated/nginx-settings/'
      path: '/nginx-settings'
      fullPath: '/nginx-settings'
      preLoaderRoute: typeof AuthenticatedNginxSettingsIndexLazyImport
      parentRoute: typeof AuthenticatedRouteImport
    }
    '/_authenticated/notifications-settings/': {
      id: '/_authenticated/notifications-settings/'
      path: '/notifications-settings'
      fullPath: '/notifications-settings'
      preLoaderRoute: typeof AuthenticatedNotificationsSettingsIndexLazyImport
      parentRoute: typeof AuthenticatedRouteImport
    }
    '/_authenticated/proxy-manager/': {
      id: '/_authenticated/proxy-manager/'
      path: '/proxy-manager'
      fullPath: '/proxy-manager'
      preLoaderRoute: typeof AuthenticatedProxyManagerIndexLazyImport
      parentRoute: typeof AuthenticatedRouteImport
    }
    '/_authenticated/ssl-manager/': {
      id: '/_authenticated/ssl-manager/'
      path: '/ssl-manager'
      fullPath: '/ssl-manager'
      preLoaderRoute: typeof AuthenticatedSslManagerIndexLazyImport
      parentRoute: typeof AuthenticatedRouteImport
    }
    '/_authenticated/upstreams/': {
      id: '/_authenticated/upstreams/'
      path: '/upstreams'
      fullPath: '/upstreams'
      preLoaderRoute: typeof AuthenticatedUpstreamsIndexLazyImport
      parentRoute: typeof AuthenticatedRouteImport
    }
    '/_authenticated/uptime/': {
      id: '/_authenticated/uptime/'
      path: '/uptime'
      fullPath: '/uptime'
      preLoaderRoute: typeof AuthenticatedUptimeIndexLazyImport
      parentRoute: typeof AuthenticatedRouteImport
    }
    '/_authenticated/users/': {
      id: '/_authenticated/users/'
      path: '/users'
      fullPath: '/users'
      preLoaderRoute: typeof AuthenticatedUsersIndexLazyImport
      parentRoute: typeof AuthenticatedRouteImport
    }
    '/_authenticated/proxy-manager/$id/$nav/': {
      id: '/_authenticated/proxy-manager/$id/$nav/'
      path: '/proxy-manager/$id/$nav'
      fullPath: '/proxy-manager/$id/$nav'
      preLoaderRoute: typeof AuthenticatedProxyManagerIdNavIndexImport
      parentRoute: typeof AuthenticatedRouteImport
    }
  }
}

// Create and export the route tree

interface AuthenticatedRouteRouteChildren {
  AuthenticatedIndexRoute: typeof AuthenticatedIndexRoute
  AuthenticatedAccessListIndexLazyRoute: typeof AuthenticatedAccessListIndexLazyRoute
  AuthenticatedAccountIndexLazyRoute: typeof AuthenticatedAccountIndexLazyRoute
  AuthenticatedApiSettingsIndexLazyRoute: typeof AuthenticatedApiSettingsIndexLazyRoute
  AuthenticatedGeneralSettingsIndexLazyRoute: typeof AuthenticatedGeneralSettingsIndexLazyRoute
  AuthenticatedLogsSettingsIndexLazyRoute: typeof AuthenticatedLogsSettingsIndexLazyRoute
  AuthenticatedNginxSettingsIndexLazyRoute: typeof AuthenticatedNginxSettingsIndexLazyRoute
  AuthenticatedNotificationsSettingsIndexLazyRoute: typeof AuthenticatedNotificationsSettingsIndexLazyRoute
  AuthenticatedProxyManagerIndexLazyRoute: typeof AuthenticatedProxyManagerIndexLazyRoute
  AuthenticatedSslManagerIndexLazyRoute: typeof AuthenticatedSslManagerIndexLazyRoute
  AuthenticatedUpstreamsIndexLazyRoute: typeof AuthenticatedUpstreamsIndexLazyRoute
  AuthenticatedUptimeIndexLazyRoute: typeof AuthenticatedUptimeIndexLazyRoute
  AuthenticatedUsersIndexLazyRoute: typeof AuthenticatedUsersIndexLazyRoute
  AuthenticatedProxyManagerIdNavIndexRoute: typeof AuthenticatedProxyManagerIdNavIndexRoute
}

const AuthenticatedRouteRouteChildren: AuthenticatedRouteRouteChildren = {
  AuthenticatedIndexRoute: AuthenticatedIndexRoute,
  AuthenticatedAccessListIndexLazyRoute: AuthenticatedAccessListIndexLazyRoute,
  AuthenticatedAccountIndexLazyRoute: AuthenticatedAccountIndexLazyRoute,
  AuthenticatedApiSettingsIndexLazyRoute:
    AuthenticatedApiSettingsIndexLazyRoute,
  AuthenticatedGeneralSettingsIndexLazyRoute:
    AuthenticatedGeneralSettingsIndexLazyRoute,
  AuthenticatedLogsSettingsIndexLazyRoute:
    AuthenticatedLogsSettingsIndexLazyRoute,
  AuthenticatedNginxSettingsIndexLazyRoute:
    AuthenticatedNginxSettingsIndexLazyRoute,
  AuthenticatedNotificationsSettingsIndexLazyRoute:
    AuthenticatedNotificationsSettingsIndexLazyRoute,
  AuthenticatedProxyManagerIndexLazyRoute:
    AuthenticatedProxyManagerIndexLazyRoute,
  AuthenticatedSslManagerIndexLazyRoute: AuthenticatedSslManagerIndexLazyRoute,
  AuthenticatedUpstreamsIndexLazyRoute: AuthenticatedUpstreamsIndexLazyRoute,
  AuthenticatedUptimeIndexLazyRoute: AuthenticatedUptimeIndexLazyRoute,
  AuthenticatedUsersIndexLazyRoute: AuthenticatedUsersIndexLazyRoute,
  AuthenticatedProxyManagerIdNavIndexRoute:
    AuthenticatedProxyManagerIdNavIndexRoute,
}

const AuthenticatedRouteRouteWithChildren =
  AuthenticatedRouteRoute._addFileChildren(AuthenticatedRouteRouteChildren)

export interface FileRoutesByFullPath {
  '': typeof AuthenticatedRouteRouteWithChildren
  '/500': typeof auth500Route
  '/forgot-password': typeof authForgotPasswordRoute
  '/sign-in': typeof authSignInRoute
  '/': typeof AuthenticatedIndexRoute
  '/access-list': typeof AuthenticatedAccessListIndexLazyRoute
  '/account': typeof AuthenticatedAccountIndexLazyRoute
  '/api-settings': typeof AuthenticatedApiSettingsIndexLazyRoute
  '/general-settings': typeof AuthenticatedGeneralSettingsIndexLazyRoute
  '/logs-settings': typeof AuthenticatedLogsSettingsIndexLazyRoute
  '/nginx-settings': typeof AuthenticatedNginxSettingsIndexLazyRoute
  '/notifications-settings': typeof AuthenticatedNotificationsSettingsIndexLazyRoute
  '/proxy-manager': typeof AuthenticatedProxyManagerIndexLazyRoute
  '/ssl-manager': typeof AuthenticatedSslManagerIndexLazyRoute
  '/upstreams': typeof AuthenticatedUpstreamsIndexLazyRoute
  '/uptime': typeof AuthenticatedUptimeIndexLazyRoute
  '/users': typeof AuthenticatedUsersIndexLazyRoute
  '/proxy-manager/$id/$nav': typeof AuthenticatedProxyManagerIdNavIndexRoute
}

export interface FileRoutesByTo {
  '/500': typeof auth500Route
  '/forgot-password': typeof authForgotPasswordRoute
  '/sign-in': typeof authSignInRoute
  '/': typeof AuthenticatedIndexRoute
  '/access-list': typeof AuthenticatedAccessListIndexLazyRoute
  '/account': typeof AuthenticatedAccountIndexLazyRoute
  '/api-settings': typeof AuthenticatedApiSettingsIndexLazyRoute
  '/general-settings': typeof AuthenticatedGeneralSettingsIndexLazyRoute
  '/logs-settings': typeof AuthenticatedLogsSettingsIndexLazyRoute
  '/nginx-settings': typeof AuthenticatedNginxSettingsIndexLazyRoute
  '/notifications-settings': typeof AuthenticatedNotificationsSettingsIndexLazyRoute
  '/proxy-manager': typeof AuthenticatedProxyManagerIndexLazyRoute
  '/ssl-manager': typeof AuthenticatedSslManagerIndexLazyRoute
  '/upstreams': typeof AuthenticatedUpstreamsIndexLazyRoute
  '/uptime': typeof AuthenticatedUptimeIndexLazyRoute
  '/users': typeof AuthenticatedUsersIndexLazyRoute
  '/proxy-manager/$id/$nav': typeof AuthenticatedProxyManagerIdNavIndexRoute
}

export interface FileRoutesById {
  __root__: typeof rootRoute
  '/_authenticated': typeof AuthenticatedRouteRouteWithChildren
  '/(auth)/500': typeof auth500Route
  '/(auth)/forgot-password': typeof authForgotPasswordRoute
  '/(auth)/sign-in': typeof authSignInRoute
  '/_authenticated/': typeof AuthenticatedIndexRoute
  '/_authenticated/access-list/': typeof AuthenticatedAccessListIndexLazyRoute
  '/_authenticated/account/': typeof AuthenticatedAccountIndexLazyRoute
  '/_authenticated/api-settings/': typeof AuthenticatedApiSettingsIndexLazyRoute
  '/_authenticated/general-settings/': typeof AuthenticatedGeneralSettingsIndexLazyRoute
  '/_authenticated/logs-settings/': typeof AuthenticatedLogsSettingsIndexLazyRoute
  '/_authenticated/nginx-settings/': typeof AuthenticatedNginxSettingsIndexLazyRoute
  '/_authenticated/notifications-settings/': typeof AuthenticatedNotificationsSettingsIndexLazyRoute
  '/_authenticated/proxy-manager/': typeof AuthenticatedProxyManagerIndexLazyRoute
  '/_authenticated/ssl-manager/': typeof AuthenticatedSslManagerIndexLazyRoute
  '/_authenticated/upstreams/': typeof AuthenticatedUpstreamsIndexLazyRoute
  '/_authenticated/uptime/': typeof AuthenticatedUptimeIndexLazyRoute
  '/_authenticated/users/': typeof AuthenticatedUsersIndexLazyRoute
  '/_authenticated/proxy-manager/$id/$nav/': typeof AuthenticatedProxyManagerIdNavIndexRoute
}

export interface FileRouteTypes {
  fileRoutesByFullPath: FileRoutesByFullPath
  fullPaths:
    | ''
    | '/500'
    | '/forgot-password'
    | '/sign-in'
    | '/'
    | '/access-list'
    | '/account'
    | '/api-settings'
    | '/general-settings'
    | '/logs-settings'
    | '/nginx-settings'
    | '/notifications-settings'
    | '/proxy-manager'
    | '/ssl-manager'
    | '/upstreams'
    | '/uptime'
    | '/users'
    | '/proxy-manager/$id/$nav'
  fileRoutesByTo: FileRoutesByTo
  to:
    | '/500'
    | '/forgot-password'
    | '/sign-in'
    | '/'
    | '/access-list'
    | '/account'
    | '/api-settings'
    | '/general-settings'
    | '/logs-settings'
    | '/nginx-settings'
    | '/notifications-settings'
    | '/proxy-manager'
    | '/ssl-manager'
    | '/upstreams'
    | '/uptime'
    | '/users'
    | '/proxy-manager/$id/$nav'
  id:
    | '__root__'
    | '/_authenticated'
    | '/(auth)/500'
    | '/(auth)/forgot-password'
    | '/(auth)/sign-in'
    | '/_authenticated/'
    | '/_authenticated/access-list/'
    | '/_authenticated/account/'
    | '/_authenticated/api-settings/'
    | '/_authenticated/general-settings/'
    | '/_authenticated/logs-settings/'
    | '/_authenticated/nginx-settings/'
    | '/_authenticated/notifications-settings/'
    | '/_authenticated/proxy-manager/'
    | '/_authenticated/ssl-manager/'
    | '/_authenticated/upstreams/'
    | '/_authenticated/uptime/'
    | '/_authenticated/users/'
    | '/_authenticated/proxy-manager/$id/$nav/'
  fileRoutesById: FileRoutesById
}

export interface RootRouteChildren {
  AuthenticatedRouteRoute: typeof AuthenticatedRouteRouteWithChildren
  auth500Route: typeof auth500Route
  authForgotPasswordRoute: typeof authForgotPasswordRoute
  authSignInRoute: typeof authSignInRoute
}

const rootRouteChildren: RootRouteChildren = {
  AuthenticatedRouteRoute: AuthenticatedRouteRouteWithChildren,
  auth500Route: auth500Route,
  authForgotPasswordRoute: authForgotPasswordRoute,
  authSignInRoute: authSignInRoute,
}

export const routeTree = rootRoute
  ._addFileChildren(rootRouteChildren)
  ._addFileTypes<FileRouteTypes>()

/* ROUTE_MANIFEST_START
{
  "routes": {
    "__root__": {
      "filePath": "__root.tsx",
      "children": [
        "/_authenticated",
        "/(auth)/500",
        "/(auth)/forgot-password",
        "/(auth)/sign-in"
      ]
    },
    "/_authenticated": {
      "filePath": "_authenticated/route.tsx",
      "children": [
        "/_authenticated/",
        "/_authenticated/access-list/",
        "/_authenticated/account/",
        "/_authenticated/api-settings/",
        "/_authenticated/general-settings/",
        "/_authenticated/logs-settings/",
        "/_authenticated/nginx-settings/",
        "/_authenticated/notifications-settings/",
        "/_authenticated/proxy-manager/",
        "/_authenticated/ssl-manager/",
        "/_authenticated/upstreams/",
        "/_authenticated/uptime/",
        "/_authenticated/users/",
        "/_authenticated/proxy-manager/$id/$nav/"
      ]
    },
    "/(auth)/500": {
      "filePath": "(auth)/500.tsx"
    },
    "/(auth)/forgot-password": {
      "filePath": "(auth)/forgot-password.tsx"
    },
    "/(auth)/sign-in": {
      "filePath": "(auth)/sign-in.tsx"
    },
    "/_authenticated/": {
      "filePath": "_authenticated/index.tsx",
      "parent": "/_authenticated"
    },
    "/_authenticated/access-list/": {
      "filePath": "_authenticated/access-list/index.lazy.tsx",
      "parent": "/_authenticated"
    },
    "/_authenticated/account/": {
      "filePath": "_authenticated/account/index.lazy.tsx",
      "parent": "/_authenticated"
    },
    "/_authenticated/api-settings/": {
      "filePath": "_authenticated/api-settings/index.lazy.tsx",
      "parent": "/_authenticated"
    },
    "/_authenticated/general-settings/": {
      "filePath": "_authenticated/general-settings/index.lazy.tsx",
      "parent": "/_authenticated"
    },
    "/_authenticated/logs-settings/": {
      "filePath": "_authenticated/logs-settings/index.lazy.tsx",
      "parent": "/_authenticated"
    },
    "/_authenticated/nginx-settings/": {
      "filePath": "_authenticated/nginx-settings/index.lazy.tsx",
      "parent": "/_authenticated"
    },
    "/_authenticated/notifications-settings/": {
      "filePath": "_authenticated/notifications-settings/index.lazy.tsx",
      "parent": "/_authenticated"
    },
    "/_authenticated/proxy-manager/": {
      "filePath": "_authenticated/proxy-manager/index.lazy.tsx",
      "parent": "/_authenticated"
    },
    "/_authenticated/ssl-manager/": {
      "filePath": "_authenticated/ssl-manager/index.lazy.tsx",
      "parent": "/_authenticated"
    },
    "/_authenticated/upstreams/": {
      "filePath": "_authenticated/upstreams/index.lazy.tsx",
      "parent": "/_authenticated"
    },
    "/_authenticated/uptime/": {
      "filePath": "_authenticated/uptime/index.lazy.tsx",
      "parent": "/_authenticated"
    },
    "/_authenticated/users/": {
      "filePath": "_authenticated/users/index.lazy.tsx",
      "parent": "/_authenticated"
    },
    "/_authenticated/proxy-manager/$id/$nav/": {
      "filePath": "_authenticated/proxy-manager/$id/$nav/index.tsx",
      "parent": "/_authenticated"
    }
  }
}
ROUTE_MANIFEST_END */
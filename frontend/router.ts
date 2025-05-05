/**
 * An array of routes that are available to the Protected
 * These routes do not require authentication
 * @type {string[]}
 */

export const ProtectedRoutes = [
  "/user",
  "/conversations",
]


/**
 * An array of routes that are used for authentication
 * These routes we will redirect logged in user to /settings
 * @type {string[]}
 */

export const authRoutes = [
    "/auth",
]


export const PROTECTED_ROUTE = "/conversations"
export const API_AUTH_PREFIX = "/api"
export const DEFAULT_LOGIN_REDIRECT = "/auth"





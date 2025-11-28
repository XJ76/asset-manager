// Application constants for easy configuration

export const APP_NAME = "Asset Manager"

export const ROUTES = {
  LOGIN: "/login",
  ADMIN_DASHBOARD: "/admin",
  ADMIN_USERS: "/admin/users",
  ADMIN_CATEGORIES: "/admin/categories",
  ADMIN_DEPARTMENTS: "/admin/departments",
  ADMIN_ASSETS: "/admin/assets",
  USER_DASHBOARD: "/dashboard",
  USER_ASSETS: "/dashboard/assets",
} as const

export const ROLES = {
  ADMIN: "admin",
  USER: "user",
} as const

export const DATE_FORMAT = "yyyy-MM-dd"
export const CURRENCY_FORMAT = "USD"

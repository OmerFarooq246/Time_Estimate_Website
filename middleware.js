export { default } from "next-auth/middleware"

export const config = { matcher: ["/", "/admin"] }
// export const config = { matcher: ["/", "/project_estimates", "/admin", "/time_componets/:path*", "/estimate/:path*"] }
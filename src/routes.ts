import { type RouteConfig, index, layout, route } from "@react-router/dev/routes";

export default [
    layout("routes/_app/_authenticated.tsx", [
        index("routes/_app/home.tsx"),
        route("users", "routes/_app/users.tsx"),
        route("users/:userId", "routes/_app/userDetail.tsx"),
    ]),
    route("login", "routes/_public/login.tsx"),
    route("logout", "routes/_public/logout.tsx"),
] satisfies RouteConfig;

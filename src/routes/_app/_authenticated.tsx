import { Outlet } from "react-router";
import { isLoggedIn } from "../isLoggedIn";

export async function clientLoader() {
  await isLoggedIn();
}

export default function Authenticated() {
    return <Outlet />
}
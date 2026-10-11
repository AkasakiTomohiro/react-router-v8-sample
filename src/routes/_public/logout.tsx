import { redirect  } from "react-router";
import type { Route } from "./+types/logout";

export function clientLoader(params: Route.ClientLoaderArgs): void {
  localStorage.setItem("isLoggedIn", "false");
  throw redirect("/login")
}

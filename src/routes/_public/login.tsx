import { isLoggedOut } from "../isLoggedIn";
import { useNavigate } from "react-router";
import type { Route } from "./+types/login";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Login" },
  ];
}

const authMiddleware: Route.ClientMiddlewareFunction = async () => {
  await isLoggedOut();
}
export const clientMiddleware: Route.ClientMiddlewareFunction[] = [authMiddleware];


export default function Component({}: Route.ComponentProps) {
  const navigate = useNavigate();
  const handleLogin = () => {
    localStorage.setItem("isLoggedIn", "true");
    console.log("User logged in");
    navigate("/login");
  }
  return (
    <div>
      <button onClick={handleLogin}>Login!</button>
    </div>
  );
}
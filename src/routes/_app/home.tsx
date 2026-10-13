import type { Route } from "./+types/home";
import { Link } from "react-router";
import z from "zod";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Home" },
  ];
}

const QueryParametersValidator = z.object({
  page: z.coerce.number().int().min(1).catch(1),
  search: z.string().catch("")
})

export function clientLoader({ request }: Route.LoaderArgs) {
  const url = new URL(request.url);
  const queryParameters = {
    page: url.searchParams.get("page"),
    search: url.searchParams.get("search")
  }
  return QueryParametersValidator.parse(queryParameters);
}

export default function Component({ loaderData }: Route.ComponentProps) {
  return (
    <div>
      Home Page
      <Link to="/logout">Logout</Link>
      <br />
      page: {loaderData.page}<br />
      search: {loaderData.search}
    </div>
  );
}
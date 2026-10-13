import type { Route } from "./+types/users";
import { data, isRouteErrorResponse, Link } from "react-router";
export type Users = {
  users: {
    id: string;
    name: string;
  }[];
};

export async function clientLoader() {
  const response = await fetch("/api/users");
  const body = await response.json();
  if (response.status !== 200) {
    throw data(body, response.status);
  }
  // 200のときのレスポンスボディに対してzodのバリデーションチェック
  return body as Users;
}

function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <h1>Users</h1>
      <main>{children}</main>
    </div>
  );
}

export default function Users({ loaderData }: Route.ComponentProps) {
  return (
    <Layout>
      <ul>
        {loaderData.users.map((user) => (
          <li key={user.id}>
            {<Link to={`/users/${user.id}`}>{user.name}</Link>}
          </li>
        ))}
      </ul>
    </Layout>
  );
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  if (isRouteErrorResponse(error)) {
    // 200以外のレスポンスボディに対してzodのバリデーションチェック
    return (
      <Layout>
        Status: {error.status}
        <br />
        Code: {error.data.code}
        <br />
      </Layout>
    );
  }
  return (
    <Layout>
      <p>Something went wrong.</p>
    </Layout>
  );
}

import { data, isRouteErrorResponse, Link, Form } from "react-router";
import type { Route } from "./+types/userDetail";
import React, { useEffect } from "react";

export type User = {
  id: string;
  name: string;
};

export async function clientLoader({ params }: Route.ClientLoaderArgs) {
  const response = await fetch(`/api/users/${params.userId}`);
  const body = await response.json();
  if (response.status !== 200) {
    throw data(body, response.status);
  }
  // 200のときのレスポンスボディに対してzodのバリデーションチェック
  return body as User;
}

export async function clientAction({ params }: Route.ClientLoaderArgs) {
  const response = await fetch(`/api/users/${params.userId}`, {
    method: "PATCH",
  });
  const body = await response.json();

  return {
    status: response.status,
    code: body.code,
  } as { status: 200, code: "OK" } | {status: 500 | 501, code: "XXX_ERROR" };
}

function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <Link to="/users">Back to Users</Link>
      <main>{children}</main>
    </div>
  );
}

function ErrorAlert({ status, code }: { status: number; code: string }) {
  return (
    <p>
      Update failed with error: {code} (status: {status})
    </p>
  );
}

export default function UserDetail({
  params,
  loaderData,
  actionData
}: Route.ComponentProps) {
  // fixme: useActionStateを使ってFormの変数を管理するようにするとフォーム編集後、Updateボタンで表示が元に戻るかも？
  const [name, setName] = React.useState(loaderData.name);

  useEffect(() => {
    setName(loaderData.name);
  }, [loaderData.name]);
  
  return (
    <Layout>
      <label>UserId: {params.userId}</label>
      <Form action={`/users/${params.userId}`} method="post">
        <label>
          User Name:
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} />
        </label>
        <button type="submit">Update</button>
      </Form>
      {actionData?.status === 200 && <p>Update successful!</p>}
      {actionData !== undefined && actionData?.status !== 200 && <ErrorAlert status={actionData.status} code={actionData.code} />}
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

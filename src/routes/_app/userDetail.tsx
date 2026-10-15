import {
  data,
  isRouteErrorResponse,
  Link,
  Form,
  Await,
  useAsyncError,
} from "react-router";
import type { Route } from "./+types/userDetail";
import React, { useEffect, Suspense } from "react";

export type User = {
  id: string;
  name: string;
};

class ApiError extends Error {
  status: number;
  body: any;
  constructor(status: number, body: any) {
    super(`API Error: ${status}`);
    this.status = status;
    this.body = body;
  }
}

export function clientLoader({ params }: Route.ClientLoaderArgs) {
  const userDetailPromise = fetch(`/api/users/${params.userId}`).then(
    async (response) => {
      const body = await response.json();
      if (response.status !== 200) {
        throw new ApiError(response.status, body);
      }
      return body;
    },
  );
  return {
    user: userDetailPromise,
  };
}

export async function clientAction({ params }: Route.ClientLoaderArgs) {
  const response = await fetch(`/api/users/${params.userId}`, {
    method: "PATCH",
  });
  const body = await response.json();

  return {
    status: response.status,
    code: body.code,
  } as { status: 200; code: "OK" } | { status: 500 | 501; code: "XXX_ERROR" };
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

function UserDetailPresentation({
  user,
  isLoading,
  actionData,
}: {
  user?: User;
  isLoading?: boolean;
  actionData?: Route.ComponentProps["actionData"];
}) {
  return (
    <>
      {actionData?.status === 200 && <p>Update successful!</p>}
      {actionData !== undefined && actionData?.status !== 200 && (
        <ErrorAlert status={actionData.status} code={actionData.code} />
      )}

      <Form action={`/users/${user?.id}`} method="post">
        <p>First Name: {isLoading ? "[[Skeleton]]" : user?.name}</p>
        <p>Last Name: {isLoading ? "[[Skeleton]]" : user?.name}</p>
        <button type="submit" disabled={Boolean(isLoading)}>
          Update
        </button>
      </Form>
    </>
  );
}

function UserDetailContainer({
  user,
  actionData,
}: {
  user: User;
  actionData: Route.ComponentProps["actionData"];
}) {
  // 将来編集機能が追加される想定
  // const [user, setUser] = useState(user);
  // const [editUser, setEditUser] = useState(user);
  return <UserDetailPresentation user={user} actionData={actionData} />;
}

async function GetUserErrorBoundary() {
  const error = useAsyncError();
  console.log(error, error instanceof ApiError);
  let message = "Failed to load user data.";
  if (error instanceof ApiError) {
    // 200以外のレスポンスボディに対してzodのバリデーションチェック
    message = `API Error: ${error.status}, Code: ${error.body.code}`;
  }
  return (
    <>
      <p>{message}</p>
      <UserDetailPresentation user={{ id: "", name: "" }} />
    </>
  );
}

function UserDetailSuspense({
  userPromise,
  actionData,
}: {
  userPromise: Promise<User>;
  actionData: Route.ComponentProps["actionData"];
}) {
  return (
    <Suspense
      fallback={
        // Suspenseが事実上ローディングをしているかの状態を保持しているため、
        // コンテナー層を経由せず、直接プレゼンテーション層をマウントする
        // そうすることで、コンテナー層がローディング状態を持たずに済む
        <UserDetailPresentation isLoading />
      }
    >
      <Await resolve={userPromise} errorElement={<GetUserErrorBoundary />}>
        {/* ユーザーデータが解決されたらコンテナー層をマウントする */}
        {(user) => <UserDetailContainer user={user} actionData={actionData} />}
      </Await>
    </Suspense>
  );
}

export default function UserDetail({
  params,
  loaderData,
  actionData,
}: Route.ComponentProps) {
  return (
    <Layout>
      <label>UserId: {params.userId}</label>
      <br />
      <UserDetailSuspense
        userPromise={loaderData.user}
        actionData={actionData}
      />
    </Layout>
  );
}

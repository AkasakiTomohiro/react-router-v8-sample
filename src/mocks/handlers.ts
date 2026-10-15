import { http, HttpResponse } from "msw/http";

const users: Record<string, { id: string; name: string }> = {
  "abc-123": { id: "abc-123", name: "John" },
  "def-456": { id: "def-456", name: "Jane" },
};

export const handlers = [
  http.get("/api/users", async () => {
    await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate network delay
    return HttpResponse.json({ users: Object.values(users) });
  }),
  http.get(`/api/users/:userId`, async ({ params }) => {
    await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate network delay
    const { userId } = params;
    const user = users[userId as string];
    if (!user) {
      return HttpResponse.json({ code: "USER_NOT_FOUND" }, { status: 404 });
    }
    return HttpResponse.json(user);
  }),
  http.patch(`/api/users/:userId`, async ({ params, request }) => {
    await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate network delay
    const user = users[params.userId as string];
    if (!user) {
      return HttpResponse.json({ code: "USER_NOT_FOUND" }, { status: 404 });
    }
    const body = (await request.json()) as { name?: unknown };
    if (typeof body.name !== "string" || !body.name.trim()) {
      return HttpResponse.json({ code: "INVALID_NAME" }, { status: 400 });
    }
    user.name = body.name.trim();
    return HttpResponse.json({ code: "OK" });
  }),
];

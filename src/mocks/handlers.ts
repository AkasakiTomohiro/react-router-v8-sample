import { http, HttpResponse } from "msw/http";

export const handlers = [
  http.get("/api/users", async () => {
    await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate network delay
    // return HttpResponse.json({code: "XXX_ERROR"}, { status: 500 });
    // return HttpResponse.json({code: "XXX_ERROR"}, { status: 501 });
    return HttpResponse.json({
      users: [
        {
          id: "abc-123",
          name: "John",
        },
        {
          id: "def-456",
          name: "Jane",
        },
      ],
    });
  }),
  http.get(`/api/users/:userId`, async ({ params }) => {
    await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate network delay
    // return HttpResponse.json({code: "XXX_ERROR"}, { status: 500 });
    const { userId } = params;
    if (userId !== "abc-123" && userId !== "def-456") {
      return HttpResponse.json({ code: "USER_NOT_FOUND" }, { status: 404 });
    }
    return HttpResponse.json({
      id: userId,
      name: userId === "abc-123" ? "John" : "Jane",
    });
  }),
  http.patch(`/api/users/:userId`, async ({ params }) => {
    await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate network delay
    return HttpResponse.json({code: "XXX_ERROR"}, { status: 500 });
    const { userId } = params;
    if (userId !== "abc-123" && userId !== "def-456") {
      return HttpResponse.json({ code: "USER_NOT_FOUND" }, { status: 404 });
    }
    return HttpResponse.json({
      code: "OK"
    });
  }),
];

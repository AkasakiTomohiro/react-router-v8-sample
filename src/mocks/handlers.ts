import { http, HttpResponse } from 'msw/http'

export const handlers = [
  http.get('/api/user', () => {
    return HttpResponse.json({
      id: 'abc-123',
      firstName: 'John',
      lastName: 'Maverick',
    })
  }),
];

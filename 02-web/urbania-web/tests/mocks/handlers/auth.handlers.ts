import { http, HttpResponse } from 'msw'

export const authHandlers = [
  http.post('*/auth/login', () =>
    HttpResponse.json({
      data: {
        access_token: 'mock-jwt-token',
        token_type: 'bearer',
        expires_in: 900,
        user: {
          id: '00000000-0000-0000-0000-000000000001',
          name: 'Admin Urbania',
          email: 'admin@urbania.com',
          role: 'admin',
          status: 'active',
          mfa_enabled: false,
          phone: null,
          unit: null,
          avatar_url: null,
        },
      },
      meta: { trace_id: 'test-trace-id' },
    }),
  ),
  http.post('*/auth/refresh', () =>
    HttpResponse.json({
      data: {
        access_token: 'new-mock-jwt-token',
        expires_in: 900,
      },
      meta: { trace_id: 'test-trace-id' },
    }),
  ),
  http.get('*/auth/me', () =>
    HttpResponse.json({
      data: {
        id: '00000000-0000-0000-0000-000000000001',
        name: 'Admin Urbania',
        email: 'admin@urbania.com',
        role: 'admin',
        status: 'active',
        mfa_enabled: false,
        phone: null,
        unit: null,
        avatar_url: null,
      },
      meta: { trace_id: 'test-trace-id' },
    }),
  ),
]

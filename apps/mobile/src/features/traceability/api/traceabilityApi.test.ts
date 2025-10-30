// CommonJS-style Jest test (works with the project's jest runner)
(global as any).enqueueMock_local = jest.fn(() => Promise.resolve(undefined));
(global as any).getAuthTokenMock_local = jest.fn(() => Promise.resolve('test-token-abc'));
(global as any).loggerMock_local = { error: jest.fn(), warn: jest.fn() };

let requestHandler_local: any = null;
let responseErrorHandler_local: any = null;

jest.mock('@/lib/offline/restQueue', () => ({
  enqueueRest: (...args: any[]) => (global as any).enqueueMock_local(...args),
}));

jest.mock('@/storage/tokenStorage', () => ({
  getAuthToken: () => (global as any).getAuthTokenMock_local(),
}));

jest.mock('@/utils/logger', () => ({ logger: (global as any).loggerMock_local }));

jest.mock('axios', () => {
  return {
    create: () => {
      const handlers: any = { request: null, response: null };
      return {
        interceptors: {
          request: { use: (fn: any) => { handlers.request = fn; } },
          response: { use: (_fn: any, errFn: any) => { handlers.response = errFn; } }
        },
        post: async (url: string, data: any) => {
          let cfg: any = { url, data, method: 'post', headers: {} };
          if (handlers.request) cfg = await handlers.request(cfg);
          const error = { config: cfg, response: undefined };
          if (handlers.response) {
            return handlers.response(error);
          }
          return Promise.reject(error);
        }
      };
    }
  };
});

// Now require the module under test (after mocks are set up)
const traceabilityApi = require('./traceabilityApi');

describe('traceability offline enqueue', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    requestHandler_local = null;
    responseErrorHandler_local = null;
  });

  it('enqueues createEvent when network is unreachable and returns queued response', async () => {
    const event = { type: 'PLANTING', farmId: 'farm-1' };

    const res = await traceabilityApi.createEvent(event);

    expect(res).toEqual({ queued: true });

  expect((global as any).enqueueMock_local).toHaveBeenCalledTimes(1);
  const call: any = (global as any).enqueueMock_local.mock.calls[0][0];
    expect((call.method as string).toUpperCase()).toBe('POST');
    expect(call.url).toBe('/api/events');
    expect(call.body).toEqual(event);

    expect((global as any).getAuthTokenMock_local).toHaveBeenCalled();
  });
});


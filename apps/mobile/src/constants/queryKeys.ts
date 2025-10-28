export const queryKeys = {
  home: {
    featuredSuppliers: ['home', 'featured-suppliers'] as const
  },
  dashboard: {},
  orders: {
    list: ['orders', 'list'] as const
  },
  farms: {
    all: ['farms'] as const,
    list: (params?: { mine?: boolean }) => ['farms', 'list', params?.mine ? 'mine' : 'all'] as const,
    detail: (id: string) => ['farms', 'detail', id] as const,
    history: (id: string) => ['farms', 'history', id] as const,
    operationsList: (params?: { linked?: boolean; ownerIdentifier?: string | null }) =>
      ['operations-farms', params?.linked ? 'linked' : 'all', params?.ownerIdentifier ?? 'any'] as const
  },
  collections: {
    all: ['collections'] as const,
    list: (params?: { status?: 'pending' | 'paid' }) => ['collections', 'list', params?.status ?? 'all'] as const,
    detail: (id: string) => ['collections', 'detail', id] as const
  }
};

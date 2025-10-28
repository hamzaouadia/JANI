import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '@/constants/queryKeys';
import {
  appendFarmUpdate,
  createFarm,
  getFarm,
  getFarmHistory,
  listFarms,
  listOperationsFarms,
  updateFarm,
  searchFarms,
  linkFarm,
} from '@/features/farms/api/farmApi';
import type { Farm, OperationsFarm, SearchFarmResult } from '@/features/farms/api/farmApi';
import { enqueueRest } from '@/lib/offline/restQueue';
import { nanoid } from 'nanoid/non-secure';
import axios from 'axios';

export function useFarmsList(params: { mine?: boolean } = { mine: false }) {
  return useQuery({
    queryKey: queryKeys.farms.list({ mine: params.mine }),
    queryFn: () => listFarms({ mine: params.mine })
  });
}

export function useLinkedOperationsFarms(ownerIdentifier?: string | null, ownerRole?: string | null) {
  return useQuery<OperationsFarm[]>({
    enabled: Boolean(ownerIdentifier),
    queryKey: queryKeys.farms.operationsList({ linked: true, ownerIdentifier }),
    queryFn: () =>
      listOperationsFarms({
        linkedOnly: true,
        ownerIdentifier: ownerIdentifier ?? undefined,
        ownerRole: ownerRole ?? undefined
      })
  });
}

export function useSearchFarms() {
  return useMutation<SearchFarmResult[], unknown, string>({
    mutationFn: (q: string) => searchFarms(q),
  });
}

export function useLinkFarm() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: { farmId: string; accessCode: string }) => linkFarm(payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.farms.all });
    }
  });
}

export function useFarm(id?: string) {
  return useQuery({
    enabled: !!id,
    queryKey: queryKeys.farms.detail(id ?? ''),
    queryFn: () => getFarm(id!)
  });
}

export function useFarmHistory(id?: string) {
  return useQuery({
    enabled: !!id,
    queryKey: queryKeys.farms.history(id ?? ''),
    queryFn: () => getFarmHistory(id!)
  });
}

export function useCreateFarm() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: { name: string; location?: string }) => createFarm(payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.farms.all });
    },
    onError: async (error, payload) => {
      // Network/offline: enqueue and apply optimistic item
      if (axios.isAxiosError(error) && !error.response) {
        const optimistic: Farm = {
          _id: `tmp-${nanoid(8)}`,
          ownerUserId: 'me',
          name: payload.name,
          location: payload.location,
          status: 'active',
          notes: '',
          data: {},
          history: [],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
        const key = queryKeys.farms.list({ mine: true });
        const prev = qc.getQueryData<Farm[]>(key) ?? [];
        qc.setQueryData<Farm[]>(key, [optimistic, ...prev]);
        await enqueueRest({ method: 'post', url: '/farms', body: payload });
      } else {
        throw error;
      }
    }
  });
}

export function useUpdateFarm(id: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: Partial<Pick<Farm, 'name' | 'location' | 'status' | 'notes' | 'data'>> & { note?: string }) =>
      updateFarm(id, payload),
    onMutate: async (updates) => {
      // Optimistic update
      const detailKey = queryKeys.farms.detail(id);
      const prevDetail = qc.getQueryData<Farm>(detailKey);
      if (prevDetail) {
        const next = { ...prevDetail, ...updates, updatedAt: new Date().toISOString() } as Farm;
        qc.setQueryData(detailKey, next);
      }
      const listKey = queryKeys.farms.list({ mine: true });
      const prevList = qc.getQueryData<Farm[]>(listKey) ?? [];
      qc.setQueryData<Farm[]>(
        listKey,
        prevList.map((f) => (f._id === id ? ({ ...f, ...updates, updatedAt: new Date().toISOString() } as Farm) : f))
      );
      return { prevDetail, prevList };
    },
    onError: async (error, updates, ctx) => {
      if (axios.isAxiosError(error) && !error.response) {
        // offline: enqueue and keep optimistic
        await enqueueRest({ method: 'patch', url: `/farms/${id}`, body: updates });
        return;
      }
      // real error: rollback
      if (ctx?.prevDetail) qc.setQueryData(queryKeys.farms.detail(id), ctx.prevDetail);
      if (ctx?.prevList) qc.setQueryData(queryKeys.farms.list({ mine: true }), ctx.prevList);
    },
    onSuccess: (data) => {
      qc.setQueryData(queryKeys.farms.detail(id), data);
      qc.invalidateQueries({ queryKey: queryKeys.farms.history(id) });
      qc.invalidateQueries({ queryKey: queryKeys.farms.list({ mine: true }) });
    }
  });
}

export function useAppendFarmUpdate(id: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: { change?: Record<string, unknown>; note?: string }) => appendFarmUpdate(id, payload),
    onSuccess: (res) => {
      if (res?.history) {
        qc.setQueryData(queryKeys.farms.history(id), res.history);
      }
    }
  });
}

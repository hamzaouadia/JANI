#!/usr/bin/env node
const { randomBytes } = require('crypto');

const base = process.env.TRACEABILITY_BASE_URL || 'http://localhost:5002';
const results = [];

const randomObjectId = () => randomBytes(12).toString('hex');

const summarize = (data) => {
  if (data === null || data === undefined) return data;
  if (typeof data === 'string') {
    return data.length > 160 ? `${data.slice(0, 157)}...` : data;
  }
  if (Array.isArray(data)) {
    return `array(len=${data.length})`;
  }
  if (typeof data === 'object') {
    const keys = Object.keys(data);
    if (!keys.length) return '{}';
    const preview = keys.slice(0, 4).map((key) => {
      const value = data[key];
      if (value === null || value === undefined) return `${key}:null`;
      if (typeof value === 'string') {
        const limit = key === 'error' || key === 'message' ? 140 : 40;
        return `${key}:${value.length > limit ? `${value.slice(0, limit - 3)}...` : value}`;
      }
      if (Array.isArray(value)) {
        return `${key}:array(len=${value.length})`;
      }
      if (typeof value === 'object') {
        return `${key}:{...}`;
      }
      return `${key}:${String(value)}`;
    });
    return `{${preview.join(', ')}${keys.length > 4 ? ', ...' : ''}}`;
  }
  return data;
};

const request = async (name, path, options = {}) => {
  const { method = 'GET', body, headers = {} } = options;
  const finalHeaders = { Accept: 'application/json', ...headers };
  let payload = body;
  if (payload && typeof payload === 'object' && !(payload instanceof Buffer) && !(payload instanceof ArrayBuffer)) {
    payload = JSON.stringify(payload);
    if (!finalHeaders['Content-Type']) {
      finalHeaders['Content-Type'] = 'application/json';
    }
  }

  try {
    const response = await fetch(`${base}${path}`, { method, headers: finalHeaders, body: payload });
    const text = await response.text();
    let data = null;
    if (text) {
      try {
        data = JSON.parse(text);
      } catch {
        data = text;
      }
    }
    const entry = { name, ok: response.ok, status: response.status, summary: summarize(data) };
    results.push(entry);
    return { ...entry, data };
  } catch (error) {
    results.push({ name, ok: false, status: null, summary: error.message });
    return { ok: false, status: null, data: null, error };
  }
};

(async () => {
  const health = await request('GET /health', '/health');
  if (!health.ok) {
    console.log(JSON.stringify({ baseUrl: base, checks: results }, null, 2));
    process.exit(1);
  }
  const list = await request('GET /api/events', '/api/events?limit=5');

  let referenceEvent = null;
  if (list.ok && list.data?.data?.length) {
    referenceEvent = list.data.data[0];
  }

  const fallbackFarmId = randomObjectId();
  const fallbackUserId = randomObjectId();
  const farmId = referenceEvent?.farmId?.toString() || fallbackFarmId;
  const userId = referenceEvent?.userId && typeof referenceEvent.userId === 'object'
    ? referenceEvent.userId._id
    : referenceEvent?.userId || fallbackUserId;
  const verifierId = referenceEvent?.userId && typeof referenceEvent.userId === 'object' && referenceEvent.userId._id
    ? referenceEvent.userId._id
    : referenceEvent?.userId || randomObjectId();

  if (referenceEvent) {
    await request('GET /api/events/:id', `/api/events/${referenceEvent._id}`);
  }

  await request('GET /api/events?verified=true', '/api/events?verified=true');

  const occurredAt = new Date().toISOString();
  const eventPayload = {
  type: 'irrigation',
  farmId,
  plotId: referenceEvent?.plotId || 'automation-plot',
  userId,
    occurredAt,
    description: 'Automated QA irrigation event',
    metadata: {
      waterAmount: 1500,
      waterSource: 'well',
      irrigationMethod: 'drip',
      notes: 'Script-generated check'
    },
    location: {
      latitude: 33.5731,
      longitude: -7.5898,
      accuracy: 5
    },
    attachments: [
      {
        type: 'photo',
        url: 'http://example.com/irrigation.jpg',
        filename: 'irrigation.jpg',
        size: 1024
      }
    ]
  };

  const created = await request('POST /api/events', '/api/events', {
    method: 'POST',
    body: eventPayload
  });

  const createdEventId = created.ok && created.data?.data?._id ? created.data.data._id : null;
  const createdEvent = created.ok ? created.data?.data : null;

  if (!createdEventId) {
    console.log(JSON.stringify({ baseUrl: base, checks: results }, null, 2));
    process.exit(1);
  }

  await request('GET newly created', `/api/events/${createdEventId}`);

  const updatePayload = {
    ...eventPayload,
    description: 'Automated QA irrigation event (updated)',
    metadata: {
      ...eventPayload.metadata,
      waterAmount: 1750,
      equipmentUsed: ['pivot'],
      notes: 'Updated via automation script'
    }
  };

  await request('PUT /api/events/:id', `/api/events/${createdEventId}`, {
    method: 'PUT',
    body: updatePayload
  });

  await request('PATCH /api/events/:id/verify', `/api/events/${createdEventId}/verify`, {
    method: 'PATCH',
    body: { verifierId }
  });

  await request('GET /api/events/farm/:id/timeline', `/api/events/farm/${farmId}/timeline`);
  await request('GET /api/events/farm/:id/summary', `/api/events/farm/${farmId}/summary`);

  const bulkPayload = {
    events: [
      {
        type: 'quality_check',
        farmId,
        plotId: referenceEvent?.plotId || 'automation-plot',
        userId,
        occurredAt: new Date(Date.now() - 3600 * 1000).toISOString(),
        description: 'Bulk QA event 1',
        metadata: {
          inspectionResult: 'pass',
          notes: 'Bulk insert'
        }
      },
      {
        type: 'fertilizer_application',
        farmId,
        plotId: referenceEvent?.plotId || 'automation-plot',
        userId,
        occurredAt: new Date(Date.now() - 7200 * 1000).toISOString(),
        description: 'Bulk QA event 2',
        metadata: {
          fertilizerType: 'NPK',
          fertilizerAmount: 25,
          fertilizerUnit: 'kg'
        }
      }
    ]
  };

  const bulkCreated = await request('POST /api/events/bulk', '/api/events/bulk', {
    method: 'POST',
    body: bulkPayload
  });

  const bulkIds = bulkCreated.ok && Array.isArray(bulkCreated.data?.data)
    ? bulkCreated.data.data.map((evt) => evt._id)
    : [];

  if (bulkIds.length) {
    for (const bulkId of bulkIds) {
      await request('DELETE bulk event', `/api/events/${bulkId}`, { method: 'DELETE' });
    }
  }

  await request('DELETE /api/events/:id', `/api/events/${createdEventId}`, {
    method: 'DELETE'
  });

  console.log(JSON.stringify({ baseUrl: base, checks: results }, null, 2));

  const anyFailures = results.some((entry) => entry.ok === false);
  process.exit(anyFailures ? 1 : 0);
})().catch((error) => {
  console.error('Traceability API check failed:', error);
  process.exit(1);
});

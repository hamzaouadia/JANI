#!/usr/bin/env node
const base = process.env.AUTH_BASE_URL || 'http://localhost:4000';
const results = [];
let farmToken = null;

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
    const preview = keys.slice(0, 3).map((key) => {
      const value = data[key];
      if (value === null || value === undefined) return `${key}:null`;
      if (typeof value === 'string') {
        return `${key}:${value.length > 40 ? `${value.slice(0, 37)}...` : value}`;
      }
      if (Array.isArray(value)) {
        return `${key}:array(len=${value.length})`;
      }
      if (typeof value === 'object') {
        return `${key}:{...}`;
      }
      return `${key}:${String(value)}`;
    });
    return `{${preview.join(', ')}${keys.length > 3 ? ', ...' : ''}}`;
  }
  return data;
};

const request = async (name, path, options = {}) => {
  const { method = 'GET', body, headers = {}, auth = true } = options;
  const finalHeaders = { Accept: 'application/json', ...headers };
  let payload = body;
  if (payload && typeof payload === 'object' && !(payload instanceof Buffer) && !(payload instanceof ArrayBuffer)) {
    payload = JSON.stringify(payload);
    if (!finalHeaders['Content-Type']) {
      finalHeaders['Content-Type'] = 'application/json';
    }
  }
  if (auth && farmToken) {
    finalHeaders.Authorization = `Bearer ${farmToken}`;
  }

  try {
    const response = await fetch(`${base}${path}`, { method, headers: finalHeaders, body: payload });
    const text = await response.text();
    let data = null;
    if (text) {
      try {
        data = JSON.parse(text);
      } catch (parseErr) {
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
  const signupId = `TEMP-${Date.now()}`;
  const signupEmail = `testbuyer+${Date.now()}@jani.test`;

  await request('GET /health', '/health', { auth: false });
  await request('POST /auth/signup', '/auth/signup', {
    method: 'POST',
    auth: false,
    body: {
      email: signupEmail,
      password: 'Test123!',
      role: 'buyer',
      identifier: signupId,
      profile: {
        organizationName: 'QA Buyer Org',
        category: 'Retail QA',
        buyerCode: signupId,
        annualDemand: '10'
      }
    }
  });

  await request('POST /auth/login (new buyer)', '/auth/login', {
    method: 'POST',
    auth: false,
    body: { role: 'buyer', identifier: signupId, password: 'Test123!' }
  });

  const farmLogin = await request('POST /auth/login (farm)', '/auth/login', {
    method: 'POST',
    auth: false,
    body: { role: 'farm', identifier: 'REG-98241', password: 'Password123!' }
  });

  if (farmLogin.ok && farmLogin.data && farmLogin.data.accessToken) {
    farmToken = farmLogin.data.accessToken;
  }

  await request('POST /auth/verify', '/auth/verify', { method: 'POST' });
  await request('GET /auth/me', '/auth/me');

  const farms = await request('GET /data/farms', '/data/farms');
  let farmForLink = null;
  if (farms.ok && farms.data && Array.isArray(farms.data.farms) && farms.data.farms.length) {
    farmForLink = farms.data.farms.find((farm) => !farm.linked) || farms.data.farms[0];
  }

  await request('GET /data/partners', '/data/partners');
  await request('GET /data/orders', '/data/orders');

  if (farmForLink && farmForLink.id && farmForLink.credentials && farmForLink.credentials.registrationId) {
    await request('POST /data/farms/:id/link', `/data/farms/${farmForLink.id}/link`, {
      method: 'POST',
      body: { credential: farmForLink.credentials.registrationId }
    });
  } else {
    results.push({ name: 'POST /data/farms/:id/link', ok: false, status: null, summary: 'Skipped: no farm with credentials found' });
  }

  const mediaPrepare = await request('POST /media/prepare', '/media/prepare', {
    method: 'POST',
    body: {
      files: [
        { clientId: 'test-file', checksum: 'abc123', size: 1024, mime_type: 'image/png' }
      ]
    }
  });

  let uploadedMediaId = null;
  if (mediaPrepare.ok && mediaPrepare.data && Array.isArray(mediaPrepare.data.uploads) && mediaPrepare.data.uploads.length) {
    uploadedMediaId = mediaPrepare.data.uploads[0].id;
  }

  const syncPush = await request('POST /sync/push', '/sync/push', {
    method: 'POST',
    body: {
      events: [
        {
          clientId: `event-${Date.now()}`,
          type: 'quality_check',
          occurredAt: new Date().toISOString(),
          payload: { ok: true },
          media: [
            {
              clientId: `media-${Date.now()}`,
              checksum: 'deadbeef',
              size: 2048,
              type: 'photo',
              mimeType: 'image/jpeg'
            }
          ]
        }
      ]
    }
  });

  let syncMediaId = uploadedMediaId;
  if (syncPush.ok && syncPush.data && Array.isArray(syncPush.data.mediaPresigned) && syncPush.data.mediaPresigned.length) {
    syncMediaId = syncPush.data.mediaPresigned[0].id;
  }

  await request('GET /sync', '/sync');
  await request('GET /sync/pull?since=0', '/sync/pull?since=0');
  await request('POST /sync/commit', '/sync/commit', { method: 'POST', body: {} });

  if (syncMediaId) {
    await request('POST /sync/media/:id/complete', `/sync/media/${syncMediaId}/complete`, {
      method: 'POST',
      body: {}
    });
  } else {
    results.push({ name: 'POST /sync/media/:id/complete', ok: false, status: null, summary: 'Skipped: no media id available' });
  }

  await request('GET /jobs/ping', '/jobs/ping');
  await request('POST /jobs/merkle/run', '/jobs/merkle/run', { method: 'POST', body: {} });

  console.log(JSON.stringify({ baseUrl: base, checks: results }, null, 2));

  const anyFailures = results.some((entry) => entry.ok === false);
  process.exit(anyFailures ? 1 : 0);
})().catch((error) => {
  console.error('Auth API check failed:', error);
  process.exit(1);
});

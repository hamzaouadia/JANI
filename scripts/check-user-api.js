#!/usr/bin/env node
const base = process.env.USER_BASE_URL || 'http://localhost:5000';
const authBase = process.env.AUTH_BASE_URL || 'http://localhost:4000';
const results = [];

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

const userRequest = async (name, path, options = {}) => {
  const { method = 'GET', body, headers = {}, token } = options;
  const finalHeaders = { Accept: 'application/json', ...headers };
  let payload = body;
  if (payload && typeof payload === 'object' && !(payload instanceof Buffer) && !(payload instanceof ArrayBuffer)) {
    payload = JSON.stringify(payload);
    if (!finalHeaders['Content-Type']) {
      finalHeaders['Content-Type'] = 'application/json';
    }
  }
  if (token) {
    finalHeaders.Authorization = `Bearer ${token}`;
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

const authRequest = async (path, body) => {
  const response = await fetch(`${authBase}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify(body)
  });
  const text = await response.text();
  let data = null;
  if (text) {
    try {
      data = JSON.parse(text);
    } catch {
      data = text;
    }
  }
  return { ok: response.ok, status: response.status, data };
};

(async () => {
  const timestamp = Date.now();
  const farmIdentifier = `USER-${timestamp}`;
  const farmName = `User QA Farm ${timestamp}`;
  const initialAccessCode = `AC-${timestamp.toString().slice(-4)}`;
  const rotatedAccessCode = `RC-${timestamp.toString().slice(-4)}`;

  const health = await userRequest('GET /health', '/health');
  if (!health.ok) {
    console.log(JSON.stringify({ baseUrl: base, checks: results }, null, 2));
    process.exit(1);
  }

  const farmLogin = await authRequest('/auth/login', {
    role: 'farm',
    identifier: 'REG-98241',
    password: 'Password123!'
  });

  if (!farmLogin.ok || !farmLogin.data?.accessToken) {
    results.push({ name: 'auth.login farm', ok: false, status: farmLogin.status ?? null, summary: summarize(farmLogin.data) });
    console.log(JSON.stringify({ baseUrl: base, checks: results }, null, 2));
    process.exit(1);
  }

  const ownerToken = farmLogin.data.accessToken;
  const ownerId = farmLogin.data.user?.id || farmLogin.data.user?._id;

  const createFarm = await userRequest('POST /farms', '/farms', {
    method: 'POST',
    token: ownerToken,
    body: {
      name: farmName,
      identifier: farmIdentifier,
      location: 'Automation Test Plot',
      status: 'active',
      notes: 'Created by check-user-api script',
      data: {
        hectares: 42,
        primaryCrop: 'Avocado'
      },
      accessCode: initialAccessCode
    }
  });

  const farmId = createFarm.ok ? createFarm.data?._id || createFarm.data?.id : null;

  if (!farmId) {
    console.log(JSON.stringify({ baseUrl: base, checks: results }, null, 2));
    process.exit(1);
  }

  await userRequest('GET /farms', '/farms', { token: ownerToken });
  await userRequest('GET /farms?mine=1', '/farms?mine=1', { token: ownerToken });
  await userRequest('GET /farms/:id', `/farms/${farmId}`, { token: ownerToken });

  await userRequest('PATCH /farms/:id', `/farms/${farmId}`, {
    method: 'PATCH',
    token: ownerToken,
    body: {
      notes: 'Updated by automation script',
      status: 'pending_review',
      data: {
        hectares: 45,
        irrigation: 'drip'
      }
    }
  });

  await userRequest('POST /farms/:id/updates', `/farms/${farmId}/updates`, {
    method: 'POST',
    token: ownerToken,
    body: {
      change: { inspection: 'scheduled' },
      note: 'Automation update entry'
    }
  });

  await userRequest('PATCH /farms/:id/access-code', `/farms/${farmId}/access-code`, {
    method: 'PATCH',
    token: ownerToken,
    body: {
      accessCode: rotatedAccessCode
    }
  });

  await userRequest('GET /farms/:id/history', `/farms/${farmId}/history`, { token: ownerToken });
  await userRequest('GET /farms/search', `/farms/search?q=${encodeURIComponent(farmIdentifier.slice(0, 6))}`, { token: ownerToken });
  await userRequest('GET /data/orders', '/data/orders', { token: ownerToken });

  const buyerIdentifier = `BUY-${timestamp}`;
  const buyerSignup = await authRequest('/auth/signup', {
    email: `test-buyer-${timestamp}@jani.test`,
    password: 'BuyerPass123!',
    role: 'buyer',
    identifier: buyerIdentifier,
    profile: {
      organizationName: 'QA Buyer Org',
      category: 'Retail QA',
      buyerCode: buyerIdentifier,
      annualDemand: '5'
    }
  });

  let memberToken = null;
  let memberId = null;

  if (buyerSignup.ok && buyerSignup.data?.accessToken) {
    memberToken = buyerSignup.data.accessToken;
    memberId = buyerSignup.data.user?.id || buyerSignup.data.user?._id;
  } else {
    const buyerLogin = await authRequest('/auth/login', {
      role: 'buyer',
      identifier: buyerIdentifier,
      password: 'BuyerPass123!'
    });
    if (buyerLogin.ok && buyerLogin.data?.accessToken) {
      memberToken = buyerLogin.data.accessToken;
      memberId = buyerLogin.data.user?.id || buyerLogin.data.user?._id;
    } else {
      results.push({ name: 'buyer token acquisition', ok: false, status: buyerSignup.status ?? buyerLogin.status ?? null, summary: summarize(buyerSignup.data || buyerLogin.data) });
    }
  }

  if (memberId) {
    await userRequest('POST /farms/:id/members', `/farms/${farmId}/members`, {
      method: 'POST',
      token: ownerToken,
      body: {
        userId: memberId,
        role: 'viewer'
      }
    });

    await userRequest('POST /farms/link (member)', '/farms/link', {
      method: 'POST',
      token: memberToken,
      body: {
        identifier: farmIdentifier,
        accessCode: rotatedAccessCode
      }
    });

    await userRequest('GET /farms (member)', '/farms', { token: memberToken });
    await userRequest('GET /farms/:id (member)', `/farms/${farmId}`, { token: memberToken });
    await userRequest('GET /farms/:id/history (member)', `/farms/${farmId}/history`, { token: memberToken });
  } else {
    results.push({ name: 'member flows', ok: false, status: null, summary: 'Skipped: unable to acquire member token' });
  }

  console.log(JSON.stringify({ baseUrl: base, checks: results }, null, 2));

  const anyFailures = results.some((entry) => entry.ok === false);
  process.exit(anyFailures ? 1 : 0);
})().catch((error) => {
  console.error('User API check failed:', error);
  process.exit(1);
});

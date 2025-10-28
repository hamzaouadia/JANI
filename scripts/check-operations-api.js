#!/usr/bin/env node
const base = process.env.OPERATIONS_BASE_URL || 'http://localhost:4003';
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
  const timestamp = Date.now();
  const farmIdentifier = `OPS-${timestamp}`;
  const farmName = `Automation Farm ${timestamp}`;
  const registrationId = `REG-${timestamp}`;
  const pin = 'PIN1234';

  const health = await request('GET /health', '/health');
  if (!health.ok) {
    console.log(JSON.stringify({ baseUrl: base, checks: results }, null, 2));
    process.exit(1);
  }

  const createdFarm = await request('POST /api/farms', '/api/farms', {
    method: 'POST',
    body: {
      ownerRole: 'farm',
      ownerIdentifier: farmIdentifier,
      name: farmName,
      primaryCrop: 'Olives',
      locationDescription: 'Automated QA payload',
      linked: false,
      nextActions: ['Initial inspection'],
      credentials: {
        registrationId,
        pin
      },
      sizeHectares: 123.45,
      tags: ['automation', 'qa']
    }
  });

  const farmId = createdFarm.ok && createdFarm.data?.data?.id ? createdFarm.data.data.id : null;

  if (!farmId) {
    console.log(JSON.stringify({ baseUrl: base, checks: results }, null, 2));
    process.exit(1);
  }

  await request('GET /api/farms/:id', `/api/farms/${farmId}`);
  await request('GET /api/farms?ownerIdentifier', `/api/farms?ownerIdentifier=${farmIdentifier}`);
  await request('GET /api/farms/search', `/api/farms/search?q=${encodeURIComponent(registrationId.slice(0, 6))}&ownerIdentifier=${farmIdentifier}`);

  await request('POST /api/farms/:id/link', `/api/farms/${farmId}/link`, {
    method: 'POST',
    body: { accessCode: pin }
  });

  await request('PUT /api/farms/:id', `/api/farms/${farmId}`, {
    method: 'PUT',
    body: {
      status: 'inactive',
      tags: ['automation', 'qa', 'linked'],
      nextActions: ['Verify linkage results']
    }
  });

  await request('GET /api/farms/:id/summary', `/api/farms/${farmId}/summary`);

  const createField = await request('POST /api/fields', '/api/fields', {
    method: 'POST',
    body: {
      farmId,
      name: `QA Plot ${timestamp}`,
      hectares: 12.5,
      crop: 'Olives',
      stage: 'flowering',
      linked: false,
      sensors: {
        soilMoisture: 'sensor-xyz',
        weatherStation: true,
        logisticsPartner: 'LogisticsCo'
      },
      nextActions: ['Install irrigation dripline']
    }
  });

  const fieldId = createField.ok && createField.data?.data?._id ? createField.data.data._id : null;

  if (!fieldId) {
    console.log(JSON.stringify({ baseUrl: base, checks: results }, null, 2));
    process.exit(1);
  }

  await request('GET /api/fields?farmId', `/api/fields?farmId=${farmId}`);
  await request('GET /api/fields/:id', `/api/fields/${fieldId}`);

  await request('PUT /api/fields/:id', `/api/fields/${fieldId}`, {
    method: 'PUT',
    body: {
      stage: 'harvest-ready',
      linked: true,
      nextActions: ['Schedule harvest crew']
    }
  });

  const boundaryPayload = {
    type: 'Polygon',
    coordinates: [
      [
        [-7.0, 33.0],
        [-7.001, 33.0],
        [-7.001, 33.001],
        [-7.0, 33.001],
        [-7.0, 33.0]
      ]
    ]
  };

  await request('PUT /api/fields/:id/boundary', `/api/fields/${fieldId}/boundary`, {
    method: 'PUT',
    body: boundaryPayload
  });

  await request('GET /api/fields/:id/boundary', `/api/fields/${fieldId}/boundary`);

  const createActivity = await request('POST /api/activities', '/api/activities', {
    method: 'POST',
    body: {
      farmId,
      fieldId,
      type: 'irrigation',
      description: 'Irrigation cycle for QA field',
      scheduledDate: new Date().toISOString(),
      status: 'planned',
      inputs: [
        { name: 'Water', quantity: 5000, unit: 'liters' },
        { name: 'Labor hours', quantity: 3, unit: 'hours' }
      ]
    }
  });

  const activityId = createActivity.ok && createActivity.data?.data?._id ? createActivity.data.data._id : null;

  if (activityId) {
    await request('GET /api/activities?farmId', `/api/activities?farmId=${farmId}`);
    await request('GET /api/activities/:id', `/api/activities/${activityId}`);
    await request('PUT /api/activities/:id', `/api/activities/${activityId}`, {
      method: 'PUT',
      body: {
        status: 'in_progress',
        description: 'Updated by automation'
      }
    });
    await request('DELETE /api/activities/:id', `/api/activities/${activityId}`, {
      method: 'DELETE'
    });
  } else {
    results.push({ name: 'DELETE /api/activities/:id', ok: false, status: null, summary: 'Skipped: no activity id available' });
  }

  await request('DELETE /api/fields/:id', `/api/fields/${fieldId}`, {
    method: 'DELETE'
  });

  await request('DELETE /api/farms/:id', `/api/farms/${farmId}`, {
    method: 'DELETE'
  });

  console.log(JSON.stringify({ baseUrl: base, checks: results }, null, 2));

  const anyFailures = results.some((entry) => entry.ok === false);
  process.exit(anyFailures ? 1 : 0);
})().catch((error) => {
  console.error('Operations API check failed:', error);
  process.exit(1);
});

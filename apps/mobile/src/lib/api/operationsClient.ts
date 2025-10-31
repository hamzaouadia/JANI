import axios from 'axios';

import { ENV } from '@/config/env';
import { computeBase, attachAuthAndEnqueue } from '@/lib/api/common';

export const operationsClient = axios.create({
  baseURL: computeBase(ENV.OPERATIONS_BASE_URL, '4003'),
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Attach standard auth + enqueue interceptors
attachAuthAndEnqueue(operationsClient);

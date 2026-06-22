import api from './api';
import { getQueue, removeFromQueue } from './offlineQueue';

export interface SyncResult {
  success: number;
  failed: number;
}

export async function flushQueue(): Promise<SyncResult> {
  const queue = await getQueue();
  let success = 0;
  let failed = 0;

  for (const op of queue) {
    try {
      if (op.isFormData) {
        const formData = new FormData();
        Object.entries(op.body).forEach(([key, value]) => {
          if (value === undefined || value === null || value === '') return;
          if (key.startsWith('foto') && typeof value === 'string') {
            formData.append(key, { uri: value, type: 'image/jpeg', name: `${key}.jpg` } as any);
          } else {
            formData.append(key, String(value));
          }
        });
        await api.post(op.endpoint, formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
      } else {
        await api.post(op.endpoint, op.body);
      }
      await removeFromQueue(op.id);
      success++;
    } catch {
      failed++;
    }
  }

  return { success, failed };
}

import AsyncStorage from '@react-native-async-storage/async-storage';

const QUEUE_KEY = '@puraraz/offline_queue';

export interface QueuedOperation {
  id: string;
  module: string;
  endpoint: string;
  method: 'POST';
  body: Record<string, any>;
  isFormData?: boolean;
  createdAt: string;
}

export async function enqueue(op: Omit<QueuedOperation, 'id' | 'createdAt'>): Promise<void> {
  const queue = await getQueue();
  const item: QueuedOperation = {
    ...op,
    id: `${Date.now()}_${Math.random().toString(36).slice(2)}`,
    createdAt: new Date().toISOString(),
  };
  await AsyncStorage.setItem(QUEUE_KEY, JSON.stringify([...queue, item]));
}

export async function getQueue(): Promise<QueuedOperation[]> {
  const raw = await AsyncStorage.getItem(QUEUE_KEY);
  return raw ? JSON.parse(raw) : [];
}

export async function removeFromQueue(id: string): Promise<void> {
  const queue = await getQueue();
  await AsyncStorage.setItem(
    QUEUE_KEY,
    JSON.stringify(queue.filter((op) => op.id !== id))
  );
}

export async function getPendingCount(): Promise<number> {
  const queue = await getQueue();
  return queue.length;
}

import AsyncStorage from '@react-native-async-storage/async-storage';

const PREFIX = '@puraraz/cache/';

export async function saveCache(key: string, data: unknown): Promise<void> {
  try {
    await AsyncStorage.setItem(PREFIX + key, JSON.stringify(data));
  } catch {}
}

export async function loadCache<T>(key: string): Promise<T | null> {
  try {
    const raw = await AsyncStorage.getItem(PREFIX + key);
    return raw ? (JSON.parse(raw) as T) : null;
  } catch {
    return null;
  }
}

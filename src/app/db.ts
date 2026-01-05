// IndexedDB 헬퍼 함수들

const DB_NAME = 'motiondeck-db';
const DB_VERSION = 1;
const STORE_NAME = 'projects';

let db: IDBDatabase | null = null;

export const initDB = (): Promise<IDBDatabase> => {
  return new Promise((resolve, reject) => {
    if (db) {
      resolve(db);
      return;
    }

    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = () => {
      reject(request.error);
    };

    request.onsuccess = () => {
      db = request.result;
      resolve(db);
    };

    request.onupgradeneeded = (event) => {
      const database = (event.target as IDBOpenDBRequest).result;

      if (!database.objectStoreNames.contains(STORE_NAME)) {
        database.createObjectStore(STORE_NAME, { keyPath: 'id' });
      }
    };
  });
};

export const saveProjects = async (projects: any[]): Promise<void> => {
  const database = await initDB();

  return new Promise((resolve, reject) => {
    const transaction = database.transaction([STORE_NAME], 'readwrite');
    const store = transaction.objectStore(STORE_NAME);

    // 기존 데이터 삭제 후 새로 저장
    const clearRequest = store.clear();

    clearRequest.onsuccess = () => {
      projects.forEach((project) => {
        store.put(project);
      });
    };

    transaction.oncomplete = () => {
      resolve();
    };

    transaction.onerror = () => {
      reject(transaction.error);
    };
  });
};

export const loadProjects = async (): Promise<any[]> => {
  const database = await initDB();

  return new Promise((resolve, reject) => {
    const transaction = database.transaction([STORE_NAME], 'readonly');
    const store = transaction.objectStore(STORE_NAME);
    const request = store.getAll();

    request.onsuccess = () => {
      resolve(request.result || []);
    };

    request.onerror = () => {
      reject(request.error);
    };
  });
};

export const getStorageEstimate = async (): Promise<{ usage: number; quota: number }> => {
  if ('storage' in navigator && 'estimate' in navigator.storage) {
    const estimate = await navigator.storage.estimate();
    return {
      usage: estimate.usage || 0,
      quota: estimate.quota || 0
    };
  }
  return { usage: 0, quota: 0 };
};

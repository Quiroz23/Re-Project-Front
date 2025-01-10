// src/redux/noopStorage.ts
import createWebStorage from "redux-persist/lib/storage/createWebStorage";

interface NoopStorage {
  getItem: (key: string) => Promise<null>;
  setItem: (key: string, value: any) => Promise<any>;
  removeItem: (key: string) => Promise<void>;
}

const createNoopStorage = (): NoopStorage => {
  return {
    getItem(_key: string) {
      return Promise.resolve(null);
    },
    setItem(_key: string, value: any) {
      return Promise.resolve(value);
    },
    removeItem(_key: string) {
      return Promise.resolve();
    },
  };
};

const storage = typeof window !== "undefined" ? createWebStorage("local") : createNoopStorage();

export default storage;

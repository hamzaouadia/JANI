export type SQLiteDatabase = {
  execSync: (_sql: string) => void;
  runSync: (_sql: string, _params?: unknown[]) => void;
  getAllSync: <T = unknown>(_sql: string, _params?: unknown[]) => T[];
};

export const openDatabaseSync = (_name: string): SQLiteDatabase => {
  return {
    execSync: () => {},
    runSync: () => {},
    getAllSync: () => []
  };
};

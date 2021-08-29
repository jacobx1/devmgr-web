import Dexie from 'dexie';
import { EngineerBatchResult } from '../github/EngineerBatchResult';

const db = new Dexie('github');

interface RecordsEntry {
  id?: number;
  result: EngineerBatchResult;
}

db.version(1).stores({
  records: `++id,result`,
});

export const getRecordsTable = () => db.table<RecordsEntry>('records');

export default db;

import IndexedDBHelper from "./indexedDBHelper";

/**
 * DB
 */
const dbname = "dcApiDB";
const _store_account = "walletaccount";
const dbversion = 1;
// 数据库实例
let dbInstance: IndexedDBHelper | null = null;

// 初始化数据库并设置全局变量
async function _initializeDatabase() {
  const storeConfigs = [
    {
      // 账号信息存储,
      name: _store_account,
      keyPath: "key",
      autoIncrement: false,
      // {
      //   key: 'currentAccount',
      //   value: {
      //     url?: string;
      //     name: string,
      //     nftAccount: string,
      //     account: string,
      //     credentialId: string,
      //     iv: Uint8Array,
      //     mnemonic: ArrayBuffer,
      //     timeStamp: number,
      //     type: string,
      //   }
      // }
    },
  ];
  const dbHelper = new IndexedDBHelper(dbname, storeConfigs, dbversion);

  try {
    dbInstance = await dbHelper.open();
    console.log("数据库已打开:", dbInstance);
    return true;
  } catch (error) {
    console.warn("数据库初始化失败:", error);
    return false;
  }
}

const _getAllData = async (storeName: string) => {
  if (!dbInstance) {
    return null;
  } else {
    const data = await dbInstance.getAllData(storeName);
    return data;
  }
};

const _getData = async (storeName: string, key: string) => {
  if (!dbInstance) {
    return null;
  } else {
    const data = await dbInstance.getData(storeName, key);
    return data;
  }
};

const _queryData = async (
  storeName: string,
  indexName: string,
  queryValue: string
) => {
  if (!dbInstance) {
    return null;
  } else {
    const data = await dbInstance.queryData(storeName, indexName, queryValue);
    return data;
  }
};
const _addData = async (storeName: string, info: any) => {
  if (!dbInstance) {
    return null;
  } else {
    const data = await dbInstance.addData(storeName, info);
    return data;
  }
};

const _updateData = async (storeName: string, info: any) => {
  if (!dbInstance) {
    return null;
  } else {
    const data = await dbInstance.updateData(storeName, info);
    return data;
  }
};

const _deleteData = async (storeName: string, key: string) => {
  if (!dbInstance) {
    return null;
  } else {
    const data = await dbInstance.deleteData(storeName, key);
    return data;
  }
};

const _deleteAllData = async (storeName: string) => {
  if (!dbInstance) {
    return null;
  } else {
    const data = await dbInstance.deleteAllData(storeName);
    return data;
  }
};

export const store_account = _store_account;
export const initializeDatabase = _initializeDatabase;
export const getAllData = _getAllData;
export const getData = _getData;
export const queryData = _queryData;
export const addData = _addData;
export const updateData = _updateData;
export const deleteData = _deleteData;
export const deleteAllData = _deleteAllData;
const databaseHelper = {
  store_account,
  initializeDatabase,
  getAllData,
  getData,
  queryData,
  addData,
  updateData,
  deleteData,
  deleteAllData,
};
export default databaseHelper;

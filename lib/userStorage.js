import { get, set, del } from 'idb-keyval';

export const saveUserInfo = async (info) => {
  await set("user-info", info);
};

export const getUserInfo = async () => {
  return await get("user-info");
};

export const clearUserInfo = async () => {
  await del("user-info");
};

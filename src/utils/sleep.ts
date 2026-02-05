export const sleep = async (ms = 0) =>
  new Promise((res) => setTimeout(res, ms));

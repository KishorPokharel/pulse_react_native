import { API_BASE_URL } from "./auth";

const feedRoute = API_BASE_URL + "/feed";
export const apiGetFeed = async (token: string) => {
  const response = await fetch(feedRoute, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  const data = await response.json();
  return data;
};

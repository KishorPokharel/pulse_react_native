type LoginBody = {
  email: string;
  password: string;
};

// const API_BASE_URL = "http://localhost:8787";
export const API_BASE_URL = "http://10.0.2.2:8787";

const loginRoute = API_BASE_URL + "/login";
export const loginUser = async (body: LoginBody) => {
  const response = await fetch(loginRoute, {
    method: "post",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });
  const data = await response.json();
  if (response.status != 200) {
    throw new Error("could not login");
  }

  return data;
};

const getUserRoute = API_BASE_URL + "/me";
export const getUser = async (token: string) => {
  const response = await fetch(getUserRoute, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  const data = await response.json();
  if (response.status != 200) {
    throw new Error("could not get user");
  }

  return data;
};

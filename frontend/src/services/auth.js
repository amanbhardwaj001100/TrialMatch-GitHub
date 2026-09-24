import api from "./api";

const TOKEN_KEY = "trialmatch_token";
const USER_KEY = "trialmatch_user";

export async function registerUser({
  name,
  email,
  password,
}) {
  const response = await api.post(
    "/auth/register",
    {
      name,
      email,
      password,
    }
  );

  return response.data;
}

export async function loginUser({
  email,
  password,
}) {
  const form = new URLSearchParams();

  form.append("username", email);
  form.append("password", password);

  const response = await api.post(
    "/auth/login",
    form,
    {
      headers: {
        "Content-Type":
          "application/x-www-form-urlencoded",
      },
    }
  );

  const token = response.data.access_token;

  localStorage.setItem(
    TOKEN_KEY,
    token
  );

  const meResponse = await api.get(
    "/auth/me"
  );

  localStorage.setItem(
    USER_KEY,
    JSON.stringify(meResponse.data)
  );

  return {
    token,
    user: meResponse.data,
  };
}

export function isAuthenticated() {
  return Boolean(
    localStorage.getItem(TOKEN_KEY)
  );
}

export function getStoredToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function getStoredUser() {
  const raw =
    localStorage.getItem(USER_KEY);

  if (!raw) {
    return null;
  }

  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function logoutUser() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
}

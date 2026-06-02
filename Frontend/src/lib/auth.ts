const API_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";

export interface User {
  name: string;
  email: string;
  age?: number;
  gender?: string;
  college?: string;
  course?: string;
}

// ✅ SIGNUP → backend
export const signup = async (
  name: string,
  email: string,
  password: string,
  age: string,
  gender: string,
  college: string,
  course: string
) => {
  const res = await fetch(`${API_URL}/signup`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      name,
      email,
      password,
      age: Number(age),
      gender,
      college,
      course,
    }),
  });

  if (!res.ok) {
    throw new Error("Signup failed");
  }

  return res.json();
};

// ✅ LOGIN → token store
export const login = async (email: string, password: string) => {
  const res = await fetch(`${API_URL}/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  });

  if (!res.ok) {
    throw new Error("Invalid credentials");
  }

  const data = await res.json();

  // 🔥 TOKEN STORE
  localStorage.setItem("token", data.access_token);

  // ✅ user fetch karo backend se
  const userRes = await fetch(`${API_URL}/me`, {
    headers: {
      Authorization: `Bearer ${data.access_token}`,
    },
  });
  localStorage.getItem("user");
  const userData = await userRes.json();

  // ✅ user save karo
  localStorage.setItem("user", JSON.stringify(userData));

  return data;
};

// ✅ PROFILE FETCH
export const getCurrentUser = (): User | null => {
  const user = localStorage.getItem("user");
  return user ? JSON.parse(user) : null;
};

// ✅ LOGOUT
export const logout = () => {
  localStorage.removeItem("token");
};

// ✅ AUTH CHECK
export const isAuthenticated = (): boolean => {
  return !!localStorage.getItem("token");
};
export async function logout() {
  const res = await fetch("http://localhost:5001/auth/logout", {
    method: "POST",
    credentials: "include",
  });
  if (!res.ok) {
    throw new Error("Logout failed");
  }
  return await res.json();
}
// services/authService.ts
// Handles all authentication API calls for the frontend

export async function login(email: string, password: string) {
  const res = await fetch("http://localhost:5001/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include", 
    body: JSON.stringify({ email, password }),
  });
  if (!res.ok) {
    const data = await res.json();
    throw new Error(data.message || "Login failed");
  }
  return await res.json(); 
}
export async function getCurrentUser() {
  const res = await fetch("http://localhost:5001/auth/me", {
    method: "GET",
    credentials: "include", // send cookies
  });
  if (!res.ok) {
    return null;
  }
  return await res.json();
}

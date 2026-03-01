// Simple localStorage auth helpers

export interface User {
  username: string;
  password: string;
}

const USERS_KEY = "shakha_users";
const SESSION_KEY = "shakha_session";

export const getUsers = (): User[] => {
  const data = localStorage.getItem(USERS_KEY);
  return data ? JSON.parse(data) : [];
};

export const registerUser = (username: string, password: string): boolean => {
  const users = getUsers();
  if (users.find((u) => u.username === username)) return false;
  users.push({ username, password });
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
  return true;
};

export const loginUser = (username: string, password: string): boolean => {
  const users = getUsers();
  const found = users.find(
    (u) => u.username === username && u.password === password
  );
  if (found) {
    localStorage.setItem(SESSION_KEY, username);
    return true;
  }
  return false;
};

export const isLoggedIn = (): boolean => {
  return !!localStorage.getItem(SESSION_KEY);
};

export const getSession = (): string | null => {
  return localStorage.getItem(SESSION_KEY);
};

export const logout = () => {
  localStorage.removeItem(SESSION_KEY);
};

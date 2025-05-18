// Mock authentication service for development

interface User {
  id: string;
  username: string;
  email: string;
  full_name?: string;
  role?: string;
}

interface StoredUser extends User {
  password: string;
}

const USERS_STORAGE_KEY = 'foresightpm_users';
const CURRENT_USER_KEY = 'foresightpm_current_user';
const TOKEN_KEY = 'foresightpm_token';

// Helper to get users from localStorage
const getStoredUsers = (): StoredUser[] => {
  const usersJson = localStorage.getItem(USERS_STORAGE_KEY);
  return usersJson ? JSON.parse(usersJson) : [];
};

// Helper to save users to localStorage
const saveStoredUsers = (users: StoredUser[]): void => {
  localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
};

// Generate a simple mock token
const generateToken = (user: User): string => {
  return `mock-token-${user.id}-${Date.now()}`;
};

// Mock sign up
export const signUp = async (email: string, password: string, username: string, fullName?: string): Promise<User> => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const users = getStoredUsers();
  
  // Check if user already exists
  if (users.some(user => user.email === email)) {
    throw new Error('User with this email already exists');
  }
  
  if (users.some(user => user.username === username)) {
    throw new Error('User with this username already exists');
  }
  
  // Create new user
  const newUser: StoredUser = {
    id: Date.now().toString(),
    email,
    username,
    full_name: fullName,
    role: 'user',
    password
  };
  
  // Add to stored users
  users.push(newUser);
  saveStoredUsers(users);
  
  // Create user object without password
  const { password: _, ...userWithoutPassword } = newUser;
  
  // Generate and store token
  const token = generateToken(userWithoutPassword);
  localStorage.setItem(TOKEN_KEY, token);
  
  // Store current user
  localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(userWithoutPassword));
  
  return userWithoutPassword;
};

// Mock sign in
export const signIn = async (email: string, password: string): Promise<{ user: User; token: string }> => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const users = getStoredUsers();
  
  // Find user
  const user = users.find(user => user.email === email && user.password === password);
  
  if (!user) {
    throw new Error('Invalid email or password');
  }
  
  // Create user object without password
  const { password: _, ...userWithoutPassword } = user;
  
  // Generate and store token
  const token = generateToken(userWithoutPassword);
  localStorage.setItem(TOKEN_KEY, token);
  
  // Store current user
  localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(userWithoutPassword));
  
  return { user: userWithoutPassword, token };
};

// Mock sign out
export const signOut = async (): Promise<void> => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 300));
  
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(CURRENT_USER_KEY);
};

// Get current session
export const getSession = async (): Promise<{ user: User | null; token: string | null }> => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 300));
  
  const token = localStorage.getItem(TOKEN_KEY);
  const userJson = localStorage.getItem(CURRENT_USER_KEY);
  
  if (!token || !userJson) {
    return { user: null, token: null };
  }
  
  return { user: JSON.parse(userJson), token };
};

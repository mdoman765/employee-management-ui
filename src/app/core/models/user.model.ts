export interface User {
  id: number;
  username: string;
  email: string;
  roleId: number;
  roleName?: string;
  isActive: boolean;
  addedDate?: string;
  lastLoginDate?: string;
}

export interface CreateUser {
  username: string;
  email: string;
  password: string;
  roleId: number;
}

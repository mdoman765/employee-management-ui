export interface LoginRequest { username: string; password: string; }
export interface LoginResponse {
  token: string; username: string; email: string;
  role: string; userId: number; fullName?: string; phone?: string;
}
export interface ApiResponse<T> { success: boolean; message: string; data: T; errors?: string[]; }

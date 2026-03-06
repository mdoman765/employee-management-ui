export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  username: string;
  email: string;
  role: string;
  userId: number;
   name?: string;    // ✅ new
  phone?: string;   // ✅ new
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  errors?: string[];
}

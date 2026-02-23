export interface Department {
  id: number;
  name: string;
  isActive: boolean;
  createdAt?: string;
}

export interface CreateDepartment {
  name: string;
}

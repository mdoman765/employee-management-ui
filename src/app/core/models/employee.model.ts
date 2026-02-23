export interface Employee {
  id: number;
  name: string;
  email: string;
  phone?: string;
  departmentId: number;
  departmentName: string;
  designationId?: number;
  accountNumber?: string;
  addedDate?: string;
  isActive: boolean;
}

export interface CreateEmployee {
  name: string;
  email: string;
  phone?: string;
  departmentId: number;
  accountNumber?: string;
}

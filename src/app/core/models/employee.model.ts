export interface Employee {
  id: number;
  name: string;
  email: string;
  phone?: string;
  departmentId: number;
  departmentName: string;
  accountNumber?: string;
  isActive: boolean;
}
 
export interface CreateEmployee {
  name: string;
  email: string;
  phone?: string;
  departmentId: number;
  accountNumber?: string;
}


export interface Salary {
  id: number;
  employeeId: number;
  employeeName: string;
  basicSalary: number;
  bonus: number;
  deduction: number;
  netSalary: number;
  effectiveFrom: string;
  effectiveTo?: string;
  isCurrent: boolean;
}
 
export interface CreateSalary {
  employeeId: number;
  basicSalary: number;
  bonus: number;
  deduction: number;
  effectiveFrom: string;
}

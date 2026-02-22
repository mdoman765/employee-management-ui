export interface Attendance {
  id: number;
  employeeId: number;
  employeeName: string;
  checkInTime: string;
  checkOutTime?: string;
  status?: string;
}
 
export interface CreateAttendance {
  employeeId: number;
  checkInTime: string;
  checkOutTime?: string;
  status?: string;
}

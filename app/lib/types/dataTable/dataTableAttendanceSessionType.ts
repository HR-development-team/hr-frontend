import { GetAllAttendanceSessionData } from "../attendanceSession";

export interface DataTableAttendanceSessionProp {
  attendanceSession: GetAllAttendanceSessionData[];
  isLoading: boolean;
  // lazyParams: { first: number; rows: number; page: number };
  // totalItems: number;
  // onPageChange: (event: DataTablePageEvent) => void;
  onEdit: (attendanceSession: GetAllAttendanceSessionData) => void;
  onDelete: (attendanceSession: GetAllAttendanceSessionData) => void;
  onView: (attendanceSession: GetAllAttendanceSessionData) => void;
  onClose: (attendanceSession: GetAllAttendanceSessionData) => void;
}

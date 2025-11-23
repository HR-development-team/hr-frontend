export interface GetAllAttendanceSessionData {
  id: number;
  session_code: string;
  date: string;
  status: "open" | "closed";
  open_time: string;
  cutoff_time: string;
  close_time: string;
  created_by_full_name: string;
}

export interface GetAttendanceSessionByIdData
  extends GetAllAttendanceSessionData {
  created_at: string;
  updated_at: string;
}

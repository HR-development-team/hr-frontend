export interface GetAllShiftData {
  id: number;
  shift_code: string;
  name: string;
  start_time: string;
  end_time: string;
  is_overnight: boolean;
  late_tolerance_minutes: number;
  check_in_limit_minutes: number;
  check_out_limit_minutes: number;
}

export interface GetShiftByIdData extends GetAllShiftData {
  created_at: string;
  updated_at: string;
}

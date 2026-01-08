import { Axios } from "@/utils/axios";
import {
  AttendanceDetailResponse,
  AttendanceParams,
  AttendanceResponse,
} from "../schemas/attendanceSchema";
import { formatDateToYYYYMMDD } from "@/utils/dateFormat";

// Adjust endpoint if necessary (e.g., "/attendances" or "/master-attendance")
const BASE_URL = "/api/admin/attendance";

export const fetchAttendances = async (
  params: AttendanceParams
): Promise<AttendanceResponse> => {
  // 1. Prepare params (convert Dates to strings)
  const queryParams = {
    ...params,
    start_date: formatDateToYYYYMMDD(params.start_date),
    end_date: formatDateToYYYYMMDD(params.end_date),
  };

  // 2. GET request
  const response = await Axios.get(BASE_URL, { params: queryParams });
  return response.data;
};

export const fetchAttendanceById = async (
  id: number
): Promise<AttendanceDetailResponse> => {
  const response = await Axios.get(`${BASE_URL}/${id}`);
  return response.data;
};

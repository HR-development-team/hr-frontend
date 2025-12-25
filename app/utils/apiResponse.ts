/* eslint-disable @typescript-eslint/no-explicit-any */
export interface BaseApiResponse {
  status: string;
  message: string;
  datetime: string;
  meta: {
    page: number;
    limit: number;
    total: number;
    total_page: number;
  };
}

// This allows any additional properties (like master_offices, master_employees, etc.)
export type GenericApiResponse<T> = BaseApiResponse & {
  [key: string]: T[] | any;
};

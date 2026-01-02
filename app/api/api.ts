export const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const API_ENDPOINTS = {
  // Auth
  LOGIN: `${API_URL}/auth/login`,
  LOGOUT: `${API_URL}/auth/logout`,
  GETUSER: `${API_URL}/auth/me`,
  KEEPALIVE: `${API_URL}/auth/keep-alive`,

  // Master Office
  ADDOFFICE: `${API_URL}/master-offices`,
  GETALLOFFICE: `${API_URL}/master-offices`,
  EDITOFFICE: (id: string) => `${API_URL}/master-offices/${id}`,
  DELETEOFFICE: (id: string) => `${API_URL}/master-offices/${id}`,
  GETOFFICEBYID: (id: string) => `${API_URL}/master-offices/${id}`,
  GETOFFICEORGANIZATION: `${API_URL}/master-offices/organization`,
  GETOFFICEOPTION: `${API_URL}/master-offices/options`,

  // Master Departments
  ADDDEPARTMENT: `${API_URL}/master-departments`,
  GETALLDEPARTMENT: `${API_URL}/master-departments`,
  EDITDEPARTMENT: (id: string) => `${API_URL}/master-departments/${id}`,
  DELETEDEPARTMENT: (id: string) => `${API_URL}/master-departments/${id}`,
  GETDEPARTMENTBYID: (id: string) => `${API_URL}/master-departments/${id}`,
  GETDEPARTMENTOPTION: `${API_URL}/master-departments/options`,

  // Master Positions
  ADDPOSITION: `${API_URL}/master-positions`,
  GETALLPOSITION: `${API_URL}/master-positions`,
  EDITPOSITION: (id: string) => `${API_URL}/master-positions/${id}`,
  DELETEPOSITION: (id: string) => `${API_URL}/master-positions/${id}`,
  GETPOSITIONBYID: (id: string) => `${API_URL}/master-positions/${id}`,
  GETPOSITIONORGANIZATION: (office_code: string) =>
    `${API_URL}/master-positions/organization/${office_code}`,
  GETPOSITIONOPTION: `${API_URL}/master-positions/options`,

  // Master Divisions
  ADDDIVISION: `${API_URL}/master-divisions`,
  GETALLDIVISION: `${API_URL}/master-divisions`,
  EDITDIVISION: (id: string) => `${API_URL}/master-divisions/${id}`,
  DELETEDIVISION: (id: string) => `${API_URL}/master-divisions/${id}`,
  GETDIVISIONBYID: (id: string) => `${API_URL}/master-divisions/${id}`,
  GETDIVISIONOPTION: `${API_URL}/master-divisions/options`,

  // Master Employees
  ADDEMPLOYEE: `${API_URL}/master-employees`,
  GETALLEMPLOYEE: `${API_URL}/master-employees`,
  EDITEMPLOYEE: (id: string) => `${API_URL}/master-employees/${id}`,
  DELETEEMPLOYEE: (id: string) => `${API_URL}/master-employees/${id}`,
  GETEMPLOYEEBYID: (id: string) => `${API_URL}/master-employees/${id}`,

  // Master Shifts
  ADDSHIFT: `${API_URL}/master-shifts`,
  GETALLSHIFT: `${API_URL}/master-shifts`,
  EDITSHIFT: (id: string) => `${API_URL}/master-shifts/${id}`,
  DELETESHIFT: (id: string) => `${API_URL}/master-shifts/${id}`,
  GETSHIFTBYID: (id: string) => `${API_URL}/master-shifts/${id}`,
  GETSHIFTOPTION: `${API_URL}/master-shifts/options`,

  // Master Employment Status
  ADDEMPLOYEMENTSTATUS: `${API_URL}/employment-status`,
  GETALLEMPLOYEMENTSTATUS: `${API_URL}/employment-status`,
  EDITEMPLOYEMENTSTATUS: (id: string) => `${API_URL}/employment-status/${id}`,
  DELETEEMPLOYEMENTSTATUS: (id: string) => `${API_URL}/employment-status/${id}`,
  GETEMPLOYEMENTBYID: (id: string) => `${API_URL}/employment-status/${id}`,
  GETEMPLOYEMENTBYCODE: (code: string) =>
    `${API_URL}/employment-status/code/${code}`,
  GETEMPLOYEMENTOPTION: `${API_URL}/employment-status/options`,

  // User
  ADDUSER: `${API_URL}/users`,
  GETALLUSER: `${API_URL}/users`,
  EDITUSER: (id: string) => `${API_URL}/users/${id}`,
  DELETEUSER: (id: string) => `${API_URL}/users/${id}`,
  GETUSERBYID: (id: string) => `${API_URL}/users/${id}`,
  GETUSEROPTION: `${API_URL}/users/options`,

  // Role
  ADDROLE: `${API_URL}/roles`,
  GETALLROLE: `${API_URL}/roles`,
  EDITROLE: (id: string) => `${API_URL}/roles/${id}`,
  DELETEROLE: (id: string) => `${API_URL}/roles/${id}`,
  GETROLEBYID: (id: string) => `${API_URL}/roles/${id}`,
  GETROLEBYCODE: (code: string) => `${API_URL}/roles/code/${code}`,
  GETROLEOPTION: `${API_URL}/roles/options`,

  // Permission
  GETPERMISSIONBYROLECODE: (code: string) =>
    `${API_URL}/permissions/role/${code}`,
  GETCURRENTUSERPERMISSION: `${API_URL}/permissions/me/`,
  EDITPERMISSIONBYROLECODE: (code: string) =>
    `${API_URL}/permissions/role/${code}`,

  // Master Leave Type
  ADDLEAVETYPE: `${API_URL}/master-leave-types`,
  GETALLLEAVETYPE: `${API_URL}/master-leave-types`,
  EDITLEAVETYPE: (id: string) => `${API_URL}/master-leave-types/${id}`,
  DELETELEAVETYPE: (id: string) => `${API_URL}/master-leave-types/${id}`,
  GETLEAVETYPEBYID: (id: string) => `${API_URL}/master-leave-types/${id}`,

  // Dashboard
  GETADMINDASHBOARD: `${API_URL}/admin/dashboard/metrics`,
  GETEMPLOYEEDASHBOARD: `${API_URL}/employees/dashboard/metrics`,

  // Profiles
  GETPROFILES: `${API_URL}/profiles`,
  UPDATEUSERPROFILE: `${API_URL}/profiles`,

  // Leave Request
  POSTLEAVEREQUEST: `${API_URL}/employee/leave-requests`,
  GETALLLEAVEREQUEST: `${API_URL}/empoloyee/leave-requests`,
  UPDATELEAVEREQUESTSTATUS: (id: string) =>
    `${API_URL}/employee/leave-requests/${id}/status`,
  GETLEAVEBYUSER: (id: string) => `${API_URL}/leave-requests/user/${id}`,
  GETLEAVEBYEMPLOYEE: `${API_URL}/employee/leave-requests/me`,

  // Attendance Session
  ADDATTENDANCESESSION: `${API_URL}/attendance-sessions`,
  GETALLATTENDANCESESSION: `${API_URL}/attendance-sessions`,
  GETATTENDANCESESSIONBYID: (id: string) =>
    `${API_URL}/attendance-sessions/${id}`,
  EDITATTENDANCESESSION: (id: string) => `${API_URL}/attendance-sessions/${id}`,
  DELETEATTENDANCESESSION: (id: string) =>
    `${API_URL}/attendance-sessions/${id}`,
  CLOSEATTENDANCESESSION: (id: string) =>
    `${API_URL}/attendance-sessions/${id}/status`,

  // Attendances
  EMPLOYEECHECKIN: `${API_URL}/attendances/check-in`,
  EMPLOYEECHECKOUT: `${API_URL}/attendances/check-out`,
  GETALLATTENDANCE: `${API_URL}/attendances`,
  GETCURRENTEMPLOYEEATTENDANCE: `${API_URL}/attendances`,
  GETATTENDANCEBYID: (id: string) => `${API_URL}/attendance/${id}`,
  GETATTENDANCEHISTORY: `${API_URL}/attendances`,

  // Leave Balance
  ADDLEAVEBALANCEFORALL: `${API_URL}/leave-balances/bulk`,
  ADDLEAVEBALACEFORONE: `${API_URL}/leave-balances`,
  GETALLLEAVEBALANCEREPORT: `${API_URL}/leave-balances`,
  GETCURRENTEMPLOYEELEAVEBALANCE: `${API_URL}/leave-balances/me`,
  UPDATELEAVEBALANCE: (id: string) => `${API_URL}/leave-balances/${id}`,
  DELETELEAVEBALANCE: (id: string) => `${API_URL}/leave-balances/${id}`,
  DELETEALLLEAVEBALANCE: `${API_URL}/leave-balances/bulk`,

  // Payroll Periods
  ADDPAYROLLPERIOD: `${API_URL}/payroll-periods`,
  GETALLPAYROLLPERIODS: `${API_URL}/payroll-periods`,
  GETPAYROLLPERIODBYID: (id: string) => `${API_URL}/payroll-periods/${id}`,
  UPDATEPAYROLLPERIODSTATUS: (id: string) =>
    `${API_URL}/payroll-periods/${id}/status`,
  DELETEPAYROLLPERIOD: (id: string) => `${API_URL}/payroll-periods/${id}`,

  // Payroll
  GENERATEPAYROLL: `${API_URL}/payrolls/generate`,
  GETALLPAYROLL: `${API_URL}/payrolls`,
  GETPAYROLLBYID: (id: string) => `${API_URL}/payrolls/${id}`,
  EDITPAYROLL: (id: string) => `${API_URL}/payrolls/${id}`,
  DELETEPAYROLL: (id: string) => `${API_URL}/payrolls/${id}`,
};

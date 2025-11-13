export const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const API_ENDPOINTS = {
    // --- Auth ---
    LOGIN: `${API_URL}/auth/login`,
    LOGOUT: `${API_URL}/auth/logout`,
    GETUSER: `${API_URL}/auth/me`, // Get Current User

    // --- Master Departments ---
    ADDDEPARTMENT: `${API_URL}/master-departments`, // Create New Department
    GETALLDEPARTMENT: `${API_URL}/master-departments`, // Get All Department
    EDITDEPARTMENT: (id: string) => `${API_URL}/master-departments/${id}`, // Update Department By Id
    DELETEDEPARTMENT: (id: string) => `${API_URL}/master-departments/${id}`, // Delete Department By Id
    GETDEPARTMENTBYID: (id: string) => `${API_URL}/master-departments/${id}`, // Get Department By Id

    // --- INI SAYA PERBAIKI: Ini 'Master Positions' (sesuai path Anda) ---
    ADDPOSITION: `${API_URL}/master-positions`, // Create New Position
    GETALLPOSITION: `${API_URL}/master-positions`, // Get All Position
    EDITPOSITION: (id: string) => `${API_URL}/master-positions/${id}`, // Update Position By Id
    DELETEPOSITION: (id: string) => `${API_URL}/master-positions/${id}`, // Delete Position By Id
    GETPOSITIONBYID: (id: string) => `${API_URL}/master-positions/${id}`, // Get Position By Id

    // --- INI TAMBAHAN: 'Master Divisions' yang sebelumnya hilang ---
    ADDDIVISION: `${API_URL}/master-divisions`, // Create New Divisions
    GETALLDIVISION: `${API_URL}/master-divisions`, // Get All Division
    EDITDIVISION: (id: string) => `${API_URL}/master-divisions/${id}`, // Update Division By Id
    DELETEDIVISION: (id: string) => `${API_URL}/master-divisions/${id}`, // Delete Divisions By Id
    GETDIVISIONBYID: (id: string) => `${API_URL}/master-divisions/${id}`, // Get Division By Id

    // --- Master Employees ---
    ADDEMPLOYEE: `${API_URL}/master-employees`, // Create Employee
    GETALLEMPLOYEE: `${API_URL}/master-employees`, // Get All Employee
    EDITEMPLOYEE: (id: string) => `${API_URL}/master-employees/${id}`, // Update Employee By Id
    DELETEEMPLOYEE: (id: string) => `${API_URL}/master-employees/${id}`, // Delete Employee By Id
    GETEMPLOYEEBYID: (id: string) => `${API_URL}/master-employees/${id}`, // Get Employee By Id

    // --- User ---
    ADDUSER: `${API_URL}/users`, // Create User
    GETALLUSER: `${API_URL}/users`, // Get All User
    EDITUSER: (id: string) => `${API_URL}/users/${id}`, // Update User
    DELETEUSER: (id: string) => `${API_URL}/users/${id}`, // Delete User
    GETUSERBYID: (id: string) => `${API_URL}/users/${id}`, // Get User

    // --- Master Leave Type ---
    ADDLEAVETYPE: `${API_URL}/master-leave-types`, // Create New Leave Type
    GETALLLEAVETYPE: `${API_URL}/master-leave-types`, // Get All Leave Type
    EDITLEAVETYPE: (id: string) => `${API_URL}/master-leave-types/${id}`, // Update Leave Type By Id
    DELETELEAVETYPE: (id: string) => `${API_URL}/master-leave-types/${id}`, // Delete Leave Type By Id
    GETLEAVETYPEBYID: (id: string) => `${API_URL}/master-leave-types/${id}`, // Get Leave Type By Id
    
    // --- Dashboard ---
    GETADMINDASHBOARD: `${API_URL}/admin/dashboard/metrics`, // Get Admin Dashboard Data
    GETEMPLOYEEDASHBOARD: `${API_URL}/employee/dashboard/metrics`, // INI TAMBAHAN: Get Employee Dashboard Data

    // --- Profiles ---
    GETPROFILES: `${API_URL}/profiles`, // Get Profile
    UPDATEUSERPROFILE: `${API_URL}/profiles`, // Update Profile

    // --- Leave Request ---
    POSTLEAVEREQUEST: `${API_URL}/leave-requests`, // Submit Leave Request (Menggantikan POSTREQUEST)
    GETALLLEAVEREQUEST: `${API_URL}/leave-requests`, // Get All Leave Request (Menggantikan GETALLREQUEST)
    UPDATELEAVEREQUESTSTATUS: (id: string) => `${API_URL}/leave-requests/${id}/status`, // INI TAMBAHAN: Update Leave Request Status
    GETLEAVEBYUSER: (id: string) => `${API_URL}/leave-requests/user/${id}`, // Ini dari kode Anda

    // --- INI TAMBAHAN: Attendance Session ---
    ADDATTENDANCESESSION: `${API_URL}/attendance-sessions`, // Create New Attendance Session
    GETALLATTENDANCESESSION: `${API_URL}/attendance-sessions`, // Get All Attendance Session
    GETATTENDANCESESSIONBYID: (id: string) => `${API_URL}/attendance-sessions/${id}`, // Get Attendance Session By Id
    EDITATTENDANCESESSION: (id: string) => `${API_URL}/attendance-sessions/${id}`, // Update Attendance Session
    DELETEATTENDANCESESSION: (id: string) => `${API_URL}/attendance-sessions/${id}`, // Delete Attendance Session By Id
    CLOSEATTENDANCESESSION: (id: string) => `${API_URL}/attendance-sessions/${id}/close`, // Closed Attendance Session

    // --- INI TAMBAHAN: Attendances ---
    EMPLOYEECHECKIN: `${API_URL}/attendances/check-in`, // Employee Check In
    EMPLOYEECHECKOUT: `${API_URL}/attendances/check-out`, // Employee Check Out
    GETALLATTENDANCE: `${API_URL}/attendances`, // Get All Attendance
    GETCURRENTEMPLOYEEATTENDANCE: `${API_URL}/attendances`, // Get Current Employee Attendance
    GETATTENDANCEBYID: (id: string) => `${API_URL}/attendance/${id}`,

    // --- INI TAMBAHAN: Leave Balance ---
    ADDLEAVEBALANCEFORALL: `${API_URL}/leave-balances/add-all`, // Add Leave Balance For All Emp...
    GETALLLEAVEBALANCEREPORT: `${API_URL}/leave-balances/report`, // Get All Leave Balance Report
    GETCURRENTEMPLOYEELEAVEBALANCE: `${API_URL}/leave-balances/me`, // Get Current Employee Leave B...
    UPDATELEAVEBALANCE: (id: string) => `${API_URL}/leave-balances/${id}`, // Update Leave Balance For Spe...
    DELETELEAVEBALANCE: (id: string) => `${API_URL}/leave-balances/${id}`, // Delete Leave Balance for Speci...

    // --- INI TAMBAHAN: Payroll Periods ---
    ADDPAYROLLPERIOD: `${API_URL}/payroll-periods`, // Create Payroll Periods
    GETALLPAYROLLPERIODS: `${API_URL}/payroll-periods`, // Get All Payroll Periods
    GETPAYROLLPERIODBYID: (id: string) => `${API_URL}/payroll-periods/${id}`, // Get Payroll Period By Id
    UPDATEPAYROLLPERIODSTATUS: (id: string) => `${API_URL}/payroll-periods/${id}/status`, // Update Status Payroll Periods
    DELETEPAYROLLPERIOD: (id: string) => `${API_URL}/payroll-periods/${id}`, // Delete Payroll Periods

    // --- INI TAMBAHAN: Payroll ---
    GENERATEPAYROLL: `${API_URL}/payrolls/generate`, // Generate Payroll for All Employ...
    GETALLPAYROLL: `${API_URL}/payrolls`, // Get All Payroll
    GETPAYROLLBYID: (id: string) => `${API_URL}/payrolls/${id}`, // Get Payroll By Id
    EDITPAYROLL: (id: string) => `${API_URL}/payrolls/${id}`, // Update Payroll By Id
    DELETEPAYROLL: (id: string) => `${API_URL}/payrolls/${id}`, // DELETE Payroll by id
};

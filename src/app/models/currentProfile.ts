export interface CurrentProfile {
    userId: number;
    employeeId: number;
    fullName: string;
    email: string;
    phoneNumber: string;
    salary: number;
    departmentId?: number;
    departmentName?: string;
    createdAt: Date;
    updatedAt: Date;
    profileImage?: string;
}
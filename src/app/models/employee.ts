export interface Employee {
    employeeId: number;
    userId: number;
    //employeeName: string;
    //employeeEmail: string;
    email:string;
    fullName: string;
    phoneNumber: string;
    salary: number;
    departmentName?: string;
    createdAt: Date;
    isActive: boolean;
    updatedAt?: Date;
    isDeleted?: boolean;
    departmentId?: number;
    roleId?: number;
    roleName: string;
    updatedby?: number;
    createdBy?: number;
    isFistLogin?: boolean;
    positionId?: number;
    positionName?: string;
    level?: number;
}

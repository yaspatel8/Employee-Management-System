export interface BulkUpdateEmployee {
    employeeId: number;
    fullName: string;
    email: string;
    salary?: number;
    departmentId?: number;
    isActive: boolean;
    updatedby?: number;
}
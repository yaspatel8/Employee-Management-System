export interface HierarchyTree {

    employeePositionId: number;

    reportsToEmployeePositionId: number | null;

    employeeId: number;

    fullName: string;

    departmentId: number | null;

    departmentName: string | null;

    positionId: number | null;

    positionName: string | null;

    level: number;

    profileImage: string | null;
}
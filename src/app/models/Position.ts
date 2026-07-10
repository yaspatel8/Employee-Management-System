export interface Position {
    positionId: number;
    positionName: string;
    level: number;
    isActive: boolean;
    isdeleted: boolean;
    createdAt: Date;
    updatedAt?: Date;
    createdBy: number;
    updatedBy?: number;
}
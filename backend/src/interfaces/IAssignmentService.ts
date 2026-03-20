import { IAssignment } from "../models/assignment.model";
import { CreateAssignmentDTO, UpdateAssignmentDTO } from "../types";

export interface IAssignmentService {
    createAssignment(data: CreateAssignmentDTO): Promise<IAssignment>;
    getAssignmentById(id: string): Promise<IAssignment | null>;
    getAllAssignments(): Promise<IAssignment[]>;
    deleteAssignment(id: string): Promise<void>;
    regenerateAssignment(id: string): Promise<IAssignment>;
}

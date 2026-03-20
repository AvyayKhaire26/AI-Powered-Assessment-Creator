import { AssignmentModel, IAssignment } from "../models/assignment.model";
import { CreateAssignmentDTO, UpdateAssignmentDTO, GeneratedPaper, AssignmentStatus } from "../types";

export class AssignmentRepository {
    async create(data: CreateAssignmentDTO): Promise<IAssignment> {
        return AssignmentModel.create({ ...data, status: "pending" });
    }

    async findById(id: string): Promise<IAssignment | null> {
        return AssignmentModel.findById(id);
    }

    async findAll(): Promise<IAssignment[]> {
        return AssignmentModel.find().sort({ createdAt: -1 });
    }

    async update(id: string, data: UpdateAssignmentDTO): Promise<IAssignment | null> {
        return AssignmentModel.findByIdAndUpdate(id, data, { returnDocument: "after" });
    }

    async updateStatus(id: string, status: AssignmentStatus): Promise<void> {
        await AssignmentModel.findByIdAndUpdate(id, { status }, { returnDocument: "after" });
    }

    async saveResult(id: string, result: GeneratedPaper): Promise<void> {
        await AssignmentModel.findByIdAndUpdate(id, { result, status: "completed" }, { returnDocument: "after" });
    }

    async delete(id: string): Promise<void> {
        await AssignmentModel.findByIdAndDelete(id);
    }
}

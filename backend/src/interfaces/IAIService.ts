import { GeneratedPaper } from "../types";
import { IAssignment } from "../models/assignment.model";

export interface IAIService {
    generatePaper(assignment: IAssignment): Promise<GeneratedPaper>;
}

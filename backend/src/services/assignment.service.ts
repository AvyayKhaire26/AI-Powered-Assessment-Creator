import { IAssignmentService } from "../interfaces/IAssignmentService";
import { AssignmentRepository } from "../repositories/assignment.repository";
import { IAssignment } from "../models/assignment.model";
import { CreateAssignmentDTO } from "../types";
import { getAssignmentQueue } from "../config/queue";
import { getRedisConnection } from "../config/redis";
import { env } from "../config/env";
import { logger } from "../utils/logger";
import { getGenerationWorker } from "../workers/generation.worker";

const CACHE_PREFIX = "assignment:";

export class AssignmentService implements IAssignmentService {
  constructor(private readonly repository: AssignmentRepository) {}

  async createAssignment(data: CreateAssignmentDTO): Promise<IAssignment> {
    logger.info("Inside AssignmentService createAssignment()");
    try {
      const assignment = await this.repository.create(data);

      const job = await getAssignmentQueue().add("generate-assignment", {
        assignmentId: assignment._id.toString(),
      });

      getGenerationWorker();

      const updated = await this.repository.update(assignment._id.toString(), {
        jobId: job.id as string,
        status: "processing",
      });

      logger.info("End of AssignmentService createAssignment()");
      return updated!;
    } catch (error) {
      logger.error(`Error inside AssignmentService createAssignment(): ${error}`);
      throw error;
    }
  }

  async getAssignmentById(id: string): Promise<IAssignment | null> {
    logger.info("Inside AssignmentService getAssignmentById()");
    try {
      const cacheKey = `${CACHE_PREFIX}${id}`;
      const cached = await getRedisConnection().get(cacheKey);

      if (cached) {
        logger.info(`Cache hit for assignment: ${id}`);
        return JSON.parse(cached) as IAssignment;
      }

      const result = await this.repository.findById(id);

      if (result) {
        await getRedisConnection().setex(cacheKey, env.REDIS_CACHE_TTL, JSON.stringify(result));
        logger.info(`Cache set for assignment: ${id}`);
      }

      logger.info("End of AssignmentService getAssignmentById()");
      return result;
    } catch (error) {
      logger.error(`Error inside AssignmentService getAssignmentById(): ${error}`);
      throw error;
    }
  }

  async getAllAssignments(): Promise<IAssignment[]> {
    logger.info("Inside AssignmentService getAllAssignments()");
    try {
      const result = await this.repository.findAll();
      logger.info("End of AssignmentService getAllAssignments()");
      return result;
    } catch (error) {
      logger.error(`Error inside AssignmentService getAllAssignments(): ${error}`);
      throw error;
    }
  }

  async deleteAssignment(id: string): Promise<void> {
    logger.info("Inside AssignmentService deleteAssignment()");
    try {
      await this.repository.delete(id);
      await getRedisConnection().del(`${CACHE_PREFIX}${id}`);
      logger.info("End of AssignmentService deleteAssignment()");
    } catch (error) {
      logger.error(`Error inside AssignmentService deleteAssignment(): ${error}`);
      throw error;
    }
  }

  async regenerateAssignment(id: string): Promise<IAssignment> {
    logger.info("Inside AssignmentService regenerateAssignment()");
    try {
      const assignment = await this.repository.update(id, {
        status: "processing",
        result: undefined,
      });

      if (!assignment) throw new Error(`Assignment not found: ${id}`);

      await getRedisConnection().del(`${CACHE_PREFIX}${id}`);

      const job = await getAssignmentQueue().add("generate-assignment", {
        assignmentId: id,
      });

      getGenerationWorker();

      const updated = await this.repository.update(id, { jobId: job.id as string });

      logger.info("End of AssignmentService regenerateAssignment()");
      return updated!;
    } catch (error) {
      logger.error(`Error inside AssignmentService regenerateAssignment(): ${error}`);
      throw error;
    }
  }

  async invalidateCache(id: string): Promise<void> {
    await getRedisConnection().del(`${CACHE_PREFIX}${id}`);
    logger.info(`Cache invalidated for assignment: ${id}`);
  }
}

import { AssignmentService } from "../services/assignment.service";
import { AssignmentRepository } from "../repositories/assignment.repository";
import { IAssignment } from "../models/assignment.model";
import { CreateAssignmentDTO } from "../types";

// mock repository
jest.mock("../repositories/assignment.repository");

// mock queue — getter, not live instance
jest.mock("../config/queue", () => ({
  getAssignmentQueue: jest.fn().mockReturnValue({
    add: jest.fn().mockResolvedValue({ id: "job-123" }),
  }),
}));

// mock redis — define mock object INSIDE the factory to avoid hoisting issue
jest.mock("../config/redis", () => ({
  getRedisConnection: jest.fn().mockReturnValue({
    get: jest.fn().mockResolvedValue(null),
    setex: jest.fn().mockResolvedValue("OK"),
    del: jest.fn().mockResolvedValue(1),
  }),
}));

// mock worker
jest.mock("../workers/generation.worker", () => ({
  getGenerationWorker: jest.fn(),
}));

// mock logger
jest.mock("../utils/logger", () => ({
  logger: {
    info: jest.fn(),
    warn: jest.fn(),
    error: jest.fn(),
  },
}));

// ── Grab the mock redis instance AFTER jest.mock declarations ──
const getMockRedis = () => {
  const { getRedisConnection } = require("../config/redis");
  return getRedisConnection();
};

const mockAssignment = (overrides = {}): IAssignment =>
  ({
    _id: { toString: () => "assignment-123" },
    title: "Quiz on Electricity",
    subject: "Science",
    className: "8th",
    school: "Delhi Public School",
    dueDate: new Date("2026-03-25"),
    questionTypes: [{ type: "Short Answer", count: 3, marks: 2 }],
    status: "pending",
    createdAt: new Date(),
    updatedAt: new Date(),
    ...overrides,
  } as unknown as IAssignment);

const mockDTO: CreateAssignmentDTO = {
  title: "Quiz on Electricity",
  subject: "Science",
  className: "8th",
  dueDate: "2026-03-25",
  questionTypes: [{ type: "Short Answer", count: 3, marks: 2 }],
};

describe("AssignmentService", () => {
  let service: AssignmentService;
  let repository: jest.Mocked<AssignmentRepository>;

  beforeEach(() => {
    jest.clearAllMocks();
    repository = new AssignmentRepository() as jest.Mocked<AssignmentRepository>;
    service = new AssignmentService(repository);
  });

  // ─── createAssignment ───────────────────────────────────────────

  describe("createAssignment()", () => {
    it("should create assignment, enqueue job and return updated assignment", async () => {
      const created = mockAssignment({ status: "pending" });
      const updated = mockAssignment({ status: "processing", jobId: "job-123" });

      repository.create.mockResolvedValue(created);
      repository.update.mockResolvedValue(updated);

      const result = await service.createAssignment(mockDTO);

      expect(repository.create).toHaveBeenCalledWith(mockDTO);
      expect(repository.update).toHaveBeenCalledWith("assignment-123", {
        jobId: "job-123",
        status: "processing",
      });
      expect(result.status).toBe("processing");
      expect(result.jobId).toBe("job-123");
    });

    it("should throw if repository.create fails", async () => {
      repository.create.mockRejectedValue(new Error("DB error"));

      await expect(service.createAssignment(mockDTO)).rejects.toThrow("DB error");
    });
  });

  // ─── getAssignmentById ──────────────────────────────────────────

  describe("getAssignmentById()", () => {
    it("should return cached assignment if cache hit", async () => {
      const cached = mockAssignment({ status: "completed" });
      getMockRedis().get.mockResolvedValue(JSON.stringify(cached));

      const result = await service.getAssignmentById("assignment-123");

      expect(getMockRedis().get).toHaveBeenCalledWith("assignment:assignment-123");
      expect(repository.findById).not.toHaveBeenCalled();
      expect(result?.status).toBe("completed");
    });

    it("should fetch from DB and set cache on cache miss", async () => {
      const assignment = mockAssignment();
      getMockRedis().get.mockResolvedValue(null);
      repository.findById.mockResolvedValue(assignment);

      const result = await service.getAssignmentById("assignment-123");

      expect(repository.findById).toHaveBeenCalledWith("assignment-123");
      expect(getMockRedis().setex).toHaveBeenCalledWith(
        "assignment:assignment-123",
        3600,
        JSON.stringify(assignment)
      );
      expect(result).toEqual(assignment);
    });

    it("should return null if assignment not found", async () => {
      getMockRedis().get.mockResolvedValue(null);
      repository.findById.mockResolvedValue(null);

      const result = await service.getAssignmentById("nonexistent");

      expect(result).toBeNull();
      expect(getMockRedis().setex).not.toHaveBeenCalled();
    });
  });

  // ─── getAllAssignments ──────────────────────────────────────────

  describe("getAllAssignments()", () => {
    it("should return all assignments", async () => {
      const assignments = [mockAssignment(), mockAssignment({ title: "Math Quiz" })];
      repository.findAll.mockResolvedValue(assignments);

      const result = await service.getAllAssignments();

      expect(repository.findAll).toHaveBeenCalled();
      expect(result).toHaveLength(2);
    });

    it("should throw if repository.findAll fails", async () => {
      repository.findAll.mockRejectedValue(new Error("DB error"));

      await expect(service.getAllAssignments()).rejects.toThrow("DB error");
    });
  });

  // ─── deleteAssignment ──────────────────────────────────────────

  describe("deleteAssignment()", () => {
    it("should delete assignment and invalidate cache", async () => {
      repository.delete.mockResolvedValue(undefined);

      await service.deleteAssignment("assignment-123");

      expect(repository.delete).toHaveBeenCalledWith("assignment-123");
      expect(getMockRedis().del).toHaveBeenCalledWith("assignment:assignment-123");
    });

    it("should throw if repository.delete fails", async () => {
      repository.delete.mockRejectedValue(new Error("DB error"));

      await expect(service.deleteAssignment("assignment-123")).rejects.toThrow("DB error");
    });
  });

  // ─── regenerateAssignment ──────────────────────────────────────

  describe("regenerateAssignment()", () => {
    it("should reset status, invalidate cache, enqueue new job", async () => {
      const processing = mockAssignment({ status: "processing", result: undefined });
      const withJob = mockAssignment({ status: "processing", jobId: "job-456" });

      const { getAssignmentQueue } = require("../config/queue");
      getAssignmentQueue.mockReturnValue({
        add: jest.fn().mockResolvedValue({ id: "job-456" }),
      });

      repository.update
        .mockResolvedValueOnce(processing)
        .mockResolvedValueOnce(withJob);

      const result = await service.regenerateAssignment("assignment-123");

      expect(repository.update).toHaveBeenNthCalledWith(1, "assignment-123", {
        status: "processing",
        result: undefined,
      });
      expect(getMockRedis().del).toHaveBeenCalledWith("assignment:assignment-123");
      expect(result.jobId).toBe("job-456");
    });

    it("should throw if assignment not found", async () => {
      repository.update.mockResolvedValue(null);

      await expect(service.regenerateAssignment("nonexistent")).rejects.toThrow(
        "Assignment not found: nonexistent"
      );
    });
  });

  // ─── invalidateCache ──────────────────────────────────────────

  describe("invalidateCache()", () => {
    it("should delete the cache key for given id", async () => {
      await service.invalidateCache("assignment-123");

      expect(getMockRedis().del).toHaveBeenCalledWith("assignment:assignment-123");
    });
  });
});

import axios, { AxiosError } from "axios";
import { Assignment, CreateAssignmentDTO } from "@/types";

const client = axios.create({
  baseURL: `${process.env.NEXT_PUBLIC_API_URL}/api/v1`,
  headers: {
    Authorization: `Bearer ${process.env.NEXT_PUBLIC_AUTH_TOKEN}`,
    "Content-Type": "application/json",
  },
});

// ── Global error interceptor ──────────────────────────────────────────────────
client.interceptors.response.use(
  (res) => res,
  (err: AxiosError<{ message?: string }>) => {
    const status = err.response?.status;
    const serverMsg = err.response?.data?.message;

    if (status === 429) {
      return Promise.reject(new Error("Too many requests. Please wait a moment before trying again."));
    }
    if (status === 404) {
      return Promise.reject(new Error(serverMsg ?? "Resource not found."));
    }
    if (status === 401) {
      return Promise.reject(new Error("Unauthorized. Please check your credentials."));
    }
    if (status === 400) {
      return Promise.reject(new Error(serverMsg ?? "Invalid request. Please check your inputs."));
    }
    if (status && status >= 500) {
      return Promise.reject(new Error("Server error. Please try again later."));
    }

    return Promise.reject(new Error(serverMsg ?? err.message ?? "Something went wrong."));
  }
);

export const api = {
  assignments: {
    create: async (data: CreateAssignmentDTO): Promise<Assignment> => {
      const res = await client.post("/assignments", data);
      return res.data.data;
    },
    getAll: async (): Promise<Assignment[]> => {
      const res = await client.get("/assignments");
      return res.data.data;
    },
    getById: async (id: string): Promise<Assignment> => {
      const res = await client.get(`/assignments/${id}`);
      return res.data.data;
    },
    delete: async (id: string): Promise<void> => {
      await client.delete(`/assignments/${id}`);
    },
    regenerate: async (id: string): Promise<Assignment> => {
      const res = await client.post(`/assignments/${id}/regenerate`);
      return res.data.data;
    },
    // requestPdf removed — handled via window.open in store directly
  },
};

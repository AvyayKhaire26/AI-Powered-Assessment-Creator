import axios from "axios";
import { Assignment, CreateAssignmentDTO } from "@/types";

const client = axios.create({
  baseURL: `${process.env.NEXT_PUBLIC_API_URL}/api/v1`,
  headers: {
    Authorization: `Bearer ${process.env.NEXT_PUBLIC_AUTH_TOKEN}`,
    "Content-Type": "application/json",
  },
});

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
    requestPdf: async (id: string): Promise<void> => {
      await client.post(`/assignments/${id}/pdf`);
    },
  },
};

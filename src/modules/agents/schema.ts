import {z} from "zod";
export const agentsInsertSchema = z.object({
    name: z.string().min(1, {message: "Name is require"}),
    instructions: z.string().min(1, {message: "Instruction is require"}),
})
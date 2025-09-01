import {z} from "zod";

export const meetingsInsertSchema = z.object({
    name: z.string().min(1, {message: "Name is require"}),
    agentId: z.string().min(1, {message: "agent are require"}),
});

export const meetingsUpdateSchema =meetingsInsertSchema.extend({
    id: z.string().min(1,{message: "Id is required"}),
});

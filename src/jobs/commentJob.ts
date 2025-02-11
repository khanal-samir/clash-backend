import { Job, Queue, Worker } from "bullmq";
import { defaultQueueOption, redisConnection } from "../configs/queue.js";
import prisma from "../configs/db.js";

export const commentQueueName = "commentQueue";

export const commentQueue = new Queue(commentQueueName, {
  connection: redisConnection,
  defaultJobOptions: {
    ...defaultQueueOption,
    delay: 500,
  },
});

// * Workers
export const handler = new Worker(
  commentQueueName,
  async (job: Job) => {
    const data = job.data;
    await prisma.clashComments.create({
      data: {
        comment: data?.comment,
        clash_id: data?.id.toString(),
      },
    });
  },
  { connection: redisConnection }
);

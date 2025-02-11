import { Job, Queue, Worker } from "bullmq";
import { defaultQueueOption, redisConnection } from "../configs/queue.js";
import prisma from "../configs/db.js";

export const votingQueueName = "votingQueue";

export const votingQueue = new Queue(votingQueueName, {
  connection: redisConnection,
  defaultJobOptions: {
    ...defaultQueueOption,
    delay: 500, // delay 500 miliseconds--scalable
  },
});

// * Workers
export const handler = new Worker(
  votingQueueName,
  async (job: Job) => {
    const data = job.data;
    await prisma.clashItem.update({
      where: {
        id: data?.clashItemId.toString(),
      },
      data: {
        count: {
          increment: 1,
        },
      },
    });
  },
  { connection: redisConnection }
);

import { ConnectionOptions, DefaultJobOptions } from "bullmq";

export const redisConnection: ConnectionOptions = {
  host: process.env.REDIS_HOST,
  port: 6379,
};

export const defaultQueueOption: DefaultJobOptions = {
  removeOnComplete: {
    count: 20, // keeps 20 completed job on queue
    age: 60 * 60,
  },
  attempts: 3, //no of attempt for retry of a job
  backoff: {
    type: "exponential", // delay keeps on increasing 3s 6s 9s
    delay: 3000, // inital delay
  },
  removeOnFail: false, // dont remove failed jobs
};

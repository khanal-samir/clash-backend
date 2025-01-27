import { Job, Queue, Worker } from "bullmq";
import { defaultQueueOption, redisConnection } from "../configs/queue.js";
import { sendMail } from "../configs/mailer.js";

interface IEmailJobDataType {
  to: string;
  subject: string;
  html: string;
}

export const emailQueueName = "emailQueue";

export const emailQueue = new Queue(emailQueueName, {
  connection: redisConnection,
  defaultJobOptions: defaultQueueOption,
});

//worker
export const queueWorker = new Worker( // that executes job on the queue is worker
  emailQueueName,
  async (job: Job) => {
    const data: IEmailJobDataType = job.data;
    await sendMail(data.to, data.subject, data.html);
  },
  {
    connection: redisConnection,
  }
);

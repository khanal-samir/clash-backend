import { Server } from "socket.io";
import { votingQueue, votingQueueName } from "./jobs/votingJob.js";
import { commentQueue, commentQueueName } from "./jobs/commentJob.js";
export function setupSocket(io: Server) {
  io.on("connection", (socket) => {
    console.log("A user connected", socket.id);

    // * Listen every emit
    socket.onAny(async (eventName: string, data: any) => {
      if (eventName.startsWith("clashing-")) {
        await votingQueue.add(votingQueueName, data);
        socket.broadcast.emit(`clashing-${data?.clashId}`, data); // broadcast-- send to others except user
      } else if (eventName.startsWith("clashing_comment")) {
        await commentQueue.add(commentQueueName, data);
        socket.broadcast.emit(`clashing_comment-${data?.id}`, data);
      }
    });
  });
}

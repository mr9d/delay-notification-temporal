import 'dotenv/config';

import { NativeConnection, Worker } from '@temporalio/worker';
import * as activities from './activities/index';
import { TEMPORAL_HOST, TEMPORAL_NAMESPACE, TEMPORAL_PORT, TEMPORAL_TASK_QUEUE } from './shared/const';

async function run() {
  const connection = await NativeConnection.connect({
    address: `${TEMPORAL_HOST}:${TEMPORAL_PORT}`,
    // TLS and gRPC metadata configuration goes here.
  });

  try {
    const worker = await Worker.create({
      connection,
      namespace: TEMPORAL_NAMESPACE,
      taskQueue: TEMPORAL_TASK_QUEUE,
      // Workflows are registered using a path as they run in a separate JS context.
      workflowsPath: require.resolve('./workflows/index'),
      activities, // fix
    });
    await worker.run();
  } finally {
    // Close the connection once the worker has stopped
    await connection.close();
  }
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});

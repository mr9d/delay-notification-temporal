import 'dotenv/config';

import { NativeConnection, Worker } from '@temporalio/worker';
import * as activities from './activities/index';
import { TEMPORAL_HOST, TEMPORAL_NAMESPACE, TEMPORAL_PORT, TEMPORAL_TASK_QUEUE } from './shared/const';

/**
 * Main entry point for the Temporal worker. Connects to the Temporal server, registers workflows and activities, and starts polling for tasks.
 */
async function run() {
  // Establish a connection to the Temporal server using host and port from environment/config.
  const connection = await NativeConnection.connect({
    address: `${TEMPORAL_HOST}:${TEMPORAL_PORT}`,
    // TLS and gRPC metadata configuration goes here.
  });

  try {
    // Create a Temporal worker that polls the specified task queue and runs registered workflows and activities.
    // - connection: The Temporal server connection
    // - namespace: The Temporal namespace to use
    // - taskQueue: The queue this worker will poll for tasks
    // - workflowsPath: Path to the workflow module (runs in a separate JS context)
    // - activities: Object containing all activity implementations
    const worker = await Worker.create({
      connection,
      namespace: TEMPORAL_NAMESPACE,
      taskQueue: TEMPORAL_TASK_QUEUE,
      workflowsPath: require.resolve('./workflows/index'),
      activities,
    });
    // Start polling for tasks and executing workflows/activities until shutdown or error.
    await worker.run();
  } finally {
    // Close the connection once the worker has stopped
    await connection.close();
  }
}

// Run the main function and handle any uncaught errors.
run().catch((err) => {
  console.error(err);
  process.exit(1);
});

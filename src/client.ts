import 'dotenv/config';

import { Connection, Client } from '@temporalio/client';
import { checkDelayAndNotify } from './workflows/checkdelayandnotify';
import { nanoid } from 'nanoid';
import { TEMPORAL_HOST, TEMPORAL_NAMESPACE, TEMPORAL_PORT, TEMPORAL_TASK_QUEUE } from './shared/const';

/**
 * Main entry point for the Temporal client. Connects to the Temporal server and starts the workflow.
 */
async function run() {
  // Establish a connection to the Temporal server using host and port from environment/config.
  const connection = await Connection.connect({ address: `${TEMPORAL_HOST}:${TEMPORAL_PORT}` });

  // Create a Temporal client for the specified namespace.
  const client = new Client({
    connection,
    namespace: TEMPORAL_NAMESPACE,
  });

  // Start the checkDelayAndNotify workflow with test data.
  // The workflow is started on the specified task queue, with a unique workflowId and all required arguments.
  const handle = await client.workflow.start(checkDelayAndNotify, {
    taskQueue: TEMPORAL_TASK_QUEUE,
    args: [
      {
        orderId: 'order01',
        routeInfo: { originAddress: '1 Main St, Springfield, IL', destinationAddress: '456 Elm St, Shelbyville, IL' },
        promisedDurationSeconds: 1000,
        notificationThresholdSeconds: 300,
        clientInfo: {
          id: 'client01',
          firstName: 'Mike',
          secondName: 'Cold',
          email: 'mikecold@gmail.com',
          phoneNumber: '+15005550006',
        },
        clientNotificationSettings: { emailEnabled: true, smsEnabled: true },
      },
    ],
    workflowId: 'workflow-' + nanoid(),
  });

  // Log the started workflow ID.
  console.log(`Started workflow ${handle.workflowId}`);

  // Wait for the workflow to complete and log the result.
  console.log(await handle.result());
}

// Run the main function and handle any uncaught errors.
run().catch((err) => {
  console.error(err);
  process.exit(1);
});

import 'dotenv/config';

import { Connection, Client } from '@temporalio/client';
import { checkDelayAndNotify } from './workflows/checkdelayandnotify';
import { nanoid } from 'nanoid';
import { ClientInfoDto } from './dto/clientinfo';
import { RouteInfoDto } from './dto/routeinfo';
import { NotificationSettingsDto } from './dto/settings';

/**
 * Mock data for testing the workflow
 */
const MOCK_CLIENT: ClientInfoDto = {
  id: 'client01',
  firstName: 'Mike',
  secondName: 'Cold',
  email: 'mikecold@gmail.com',
  phoneNumber: '+15005550006',
};

const MOCK_ROUTE: RouteInfoDto = {
  originAddress: '1 Main St, Springfield, IL',
  destinationAddress: '456 Elm St, Shelbyville, IL',
};

const MOCK_NOTIFICATION_SETTINGS: NotificationSettingsDto = {
  emailEnabled: true,
  smsEnabled: true,
};

const MOCK_THRESHOLD_SECONDS = 300;

/**
 * Main entry point for the Temporal client. Connects to the Temporal server and starts the workflow.
 */
async function run() {
  // Validate that all required environment variables are set.
  if (
    !process.env.TEMPORAL_HOST ||
    !process.env.TEMPORAL_PORT ||
    !process.env.TEMPORAL_NAMESPACE ||
    !process.env.TEMPORAL_TASK_QUEUE
  ) {
    throw new Error(
      'One or more Temporal environment variables are not set (TEMPORAL_HOST, TEMPORAL_PORT, TEMPORAL_NAMESPACE, TEMPORAL_TASK_QUEUE)',
    );
  }

  // Establish a connection to the Temporal server using host and port from environment/config.
  const connection = await Connection.connect({ address: `${process.env.TEMPORAL_HOST}:${process.env.TEMPORAL_PORT}` });

  // Create a Temporal client for the specified namespace.
  const client = new Client({
    connection,
    namespace: process.env.TEMPORAL_NAMESPACE,
  });

  // Start the checkDelayAndNotify workflow with test data.
  // The workflow is started on the specified task queue, with a unique workflowId and all required arguments.
  const handle = await client.workflow.start(checkDelayAndNotify, {
    taskQueue: process.env.TEMPORAL_TASK_QUEUE!,
    args: [
      {
        orderId: 'order01',
        promisedDurationSeconds: 1000,
        routeInfo: MOCK_ROUTE,
        clientInfo: MOCK_CLIENT,
        clientNotificationSettings: MOCK_NOTIFICATION_SETTINGS,
        notificationThresholdSeconds: MOCK_THRESHOLD_SECONDS,
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

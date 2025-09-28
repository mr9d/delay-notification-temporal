import { Connection, Client } from '@temporalio/client';
import { checkDelayAndNotify } from './workflows/checkdelayandnotify';
import { nanoid } from 'nanoid';
import { TEMPORAL_HOST, TEMPORAL_NAMESPACE, TEMPORAL_PORT, TEMPORAL_TASK_QUEUE } from './shared/const';

async function run() {
  // Connect to the default Server location
  const connection = await Connection.connect({ address: `${TEMPORAL_HOST}:${TEMPORAL_PORT}` });
  // In production, pass options to configure TLS and other settings:
  // {
  //   address: 'foo.bar.tmprl.cloud',
  //   tls: {}
  // }

  const client = new Client({
    connection,
    namespace: TEMPORAL_NAMESPACE,
  });

  const handle = await client.workflow.start(checkDelayAndNotify, {
    taskQueue: TEMPORAL_TASK_QUEUE,
    args: [{
      routeInfo: { originAddress: '123 Main St, Springfield, IL', destinationAddress: '456 Elm St, Shelbyville, IL' },
      promisedDurationSeconds: 3600,
      notificationThresholdSeconds: 300,
      clientInfo: { id: 'client01', firstName: 'John', secondName: 'Doe' },
      clientNotificationSettings: { emailEnabled: true, smsEnabled: true }
    }],
    workflowId: 'workflow-' + nanoid(),
  });
  console.log(`Started workflow ${handle.workflowId}`);

  // optional: wait for client result
  console.log(await handle.result());
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});

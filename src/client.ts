import 'dotenv/config';

import { Connection, Client } from '@temporalio/client';
import { checkDelayAndNotify } from './workflows/checkdelayandnotify';
import { nanoid } from 'nanoid';
import { TEMPORAL_HOST, TEMPORAL_NAMESPACE, TEMPORAL_PORT, TEMPORAL_TASK_QUEUE } from './shared/const';

async function run() {
  const connection = await Connection.connect({ address: `${TEMPORAL_HOST}:${TEMPORAL_PORT}` });

  const client = new Client({
    connection,
    namespace: TEMPORAL_NAMESPACE,
  });

  const handle = await client.workflow.start(checkDelayAndNotify, {
    taskQueue: TEMPORAL_TASK_QUEUE,
    args: [{
      orderId: 'order01',
      routeInfo: { originAddress: '1 Main St, Springfield, IL', destinationAddress: '456 Elm St, Shelbyville, IL' },
      promisedDurationSeconds: 2000,
      notificationThresholdSeconds: 300,
      clientInfo: { id: 'client01', firstName: 'Mike', secondName: 'Cold' },
      clientNotificationSettings: { emailEnabled: true, smsEnabled: true }
    }],
    workflowId: 'workflow-' + nanoid(),
  });
  console.log(`Started workflow ${handle.workflowId}`);

  console.log(await handle.result());
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});

# Freight Delay Notification (Temporal + TypeScript)

A small demo that monitors a delivery route, estimates traffic delays, uses AI to craft a friendly message, and notifies the customer by Email/SMS — all orchestrated via Temporal.

## Design Decisions & Assumptions

### Backend scope

- The assignment focused on Temporal and did not include UI requirements.
- I implemented only the backend workflow and activities, with a small client script to trigger workflows for testing (similar to Temporal SDK examples).

### Workflow triggering

- The task did not define when or how the workflow should start.
- Possible real-world triggers: scheduled jobs (cron), manual start by a driver, or initiated by a manager.
- I implemented a generic client/entry point so the workflow can be run in any of these scenarios.
- Responsibility for deciding _when_ to trigger the workflow is delegated to external systems.

### Data model

- The workflow can be invoked **before the trip** (planning phase) or **during the trip** (real-time monitoring).
- To support both cases, workflow input includes:
  - **Current address / location**: if the driver is already on the road, this is the real-time GPS position; otherwise, the trip origin.

  - **Destination address**: the delivery location.

  - **Promised duration**: the expected delivery time relative to “now.”
    - If the trip has not started, this represents the entire planned route duration.

    - If the driver is en route, it represents the remaining time until the promised delivery time.

    - This field is calculated by an **external system** and passed into the workflow.

    - It can be **negative** if the promised delivery time is already missed (driver is late).

- Notifications are generated not only when the driver is **delayed**, but also when they arrive **too early**, since early deliveries can be inconvenient for the customer as well.

### Data storage

- No storage requirements were specified for customers, routes, or contacts.
- I chose a **stateless design**: all required data (contact info, route, thresholds) is passed directly in workflow input.
- In production, these details would typically be stored in a database and looked up by IDs.

### Notification channels

- Implemented both **email (SendGrid)** and **SMS (Twilio)**.
- Notifications run **in parallel** to demonstrate Temporal’s ability to coordinate concurrent activities.

### Rate limiting

- Avoiding excessive notifications (e.g., multiple SMS/email in a short time) was not part of the task.
- I assumed such logic would be handled externally, not inside the workflow itself.

## Development Stages

### 1. Learning Temporal

* My first goal was to understand what Temporal is and how it works.
* I read the official documentation and explored several sample projects provided by official site.
* Once I grasped the main concepts, I created a new Temporal project based on the *Hello World* example to verify that the environment was working correctly.

### 2. Workflow design

* I started by describing the workflow steps, their order, and dependencies.
* This helped me identify which data is required at each stage.
* I then designed data models for workflow input, workflow output, and data exchanged between activities.

### 3. Prototyping with mocks

* I initially built the full workflow using mocked activities.
* Verified that it executed correctly end-to-end before adding real integrations.

### 4. Activity implementation

* **Google Maps Routes API**: integrated and tested using mocked routes first.
* **OpenAI API**: connected to generate user-facing delay messages.
* **Fallback message generator**: implemented a simple template-based activity to be used if OpenAI was unavailable.
* **SendGrid and Twilio**: implemented activities to send notifications via email and SMS.

### 5. End-to-end testing

* Ran the workflow in different scenarios with varying input parameters and configurations.
* Verified both delay and early-arrival notifications, as well as parallel email/SMS delivery.

### 6. Finalization

* Reviewed the code, ran linters, added comments, and performed small refactorings for clarity.
* The result is a working Temporal-based service that demonstrates how to orchestrate external APIs with retries, fallbacks, and parallel activities.

## Running the project

1. `temporal server start-dev` to start Temporal Server.
2. `npm install` to install dependencies.
3. `npm run start.watch` to start the Worker.
4. In another shell, `npm run workflow` to run the Workflow Client.

The Workflow should return something similar to:

```json
{
  "success": true,
  "smsSent": 1,
  "emailsSent": 1,
  "errors": [],
  "estimatedDuration": 4555
}
```

## Technologies Used

* **Node.js** v22.17.0 ( [nodejs.org](https://nodejs.org) )

* **TypeScript** v5.6.3 ( [typescriptlang.org](https://www.typescriptlang.org) )

* **Temporal TypeScript SDK** v1.8 ( [temporal.io](https://temporal.io) | [docs.temporal.io/typescript](https://docs.temporal.io/typescript) )

* **Google Maps Routes API** ( [developers.google.com/maps/documentation/routes](https://developers.google.com/maps/documentation/routes) )

* **OpenAI API** ( [platform.openai.com](https://platform.openai.com) )

* **SendGrid SDK** ( [sendgrid.com](https://sendgrid.com) )

* **Twilio SDK** ( [twilio.com/sms](https://www.twilio.com/sms) )

* **ESLint & Prettier** ( [eslint.org](https://eslint.org) | [prettier.io](https://prettier.io) )

# n8n Reminders Workflow for Nasaq

This workflow periodically checks for due appointment reminders and sends them to customers via WhatsApp using the Nasaq API.

## Requirements

1. **n8n Instance**: You need a running instance of n8n.
2. **Nasaq Environment Variables**: Ensure your Nasaq instance has `ENABLE_UNAUTHENTICATED_DEMO_API=true` (for demo testing) or properly configured authentication.

## How to Import

1. Open your n8n dashboard.
2. Click on **Workflows** in the left menu.
3. Click the **Add Workflow** button.
4. Click the options menu (three dots) in the top right corner and select **Import from File**.
5. Select the `reminders-sender.json` file from this directory.
6. Alternatively, you can copy the contents of `reminders-sender.json` and paste it directly into the n8n editor using the **Import from URL/JSON** option.

## Configuration

Once imported, you need to configure the following nodes:

### 1. Variables

You will need to set up variables in your n8n environment or directly in the nodes:

*   `NEXT_PUBLIC_SUPABASE_URL`: Your Supabase API URL.
*   `SUPABASE_SERVICE_ROLE_KEY`: Your Supabase service role key (for authentication).
*   `APP_URL`: The URL where your Nasaq instance is running (e.g., `https://your-nasaq-domain.com`).

### 2. Schedule

By default, the workflow is scheduled to run every 15 minutes. You can adjust this by double-clicking the **Cron** trigger node and changing the interval.

## Error Handling

The workflow includes error handling mechanisms.
- Failed messages will be routed appropriately or marked as failed in the database.
- *Add dead letter queue info here*


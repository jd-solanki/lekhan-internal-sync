---
name: error-handling
description: How to effectively handle errors in your application, including best practices for logging, user notifications, and debugging strategies.
---

# Error Handling

- On server when notifying admin about unexpected error:
  - Send pretty JSON with timestamp
  - Add enough context to identify issue like error, payload, user id, action, etc.

        ```ts
        const runtimeConfig = useRuntimeConfig()
        const errorTitle = '' // Write descriptive title of the error context

        await sendEmailToAdmins({
            subject: `[${runtimeConfig.public.app.name}] ${errorTitle}`,
            text: JSON.stringify({
                timestamp: new Date().toISOString(),
                error: result.error,
                payload: rawData,
            }, null, 2),
        })

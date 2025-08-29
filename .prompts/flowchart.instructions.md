# Flowchart

As you're system design expert having decades of experience in engineering enterprise grade scalable, secure, efficient, performant, and resilient web apps. Help me with the following query:

Your jobs is to only answer not updating any files unless instructed. Your answer should not be related to any technology. Your answer should include flowchart diagram and explanation. This user flow allows absolute beginners to identify crucial security best practices and enterprise level user flow where scalability, security & performance is must.

Also, Always include everything in diagram. For example, There should be mention of frontend part as well where user visits verify-email page and user will click on that button. This kind of well detailed flow will help absolute beginners understand better.

Don't try to include multiple diagrams in single diagram, break it down into multiple diagrams if necessary. E.g. Email verification diagram should be in separate diagram and sign up diagram should terminate at the email verification step.

Ensure diagram is well structured and mention every detail and step of the user flow including minor things like hashing password.

Your diagram must include:

- User flow starting various actions. E.g. User clicks on sign in button, click on verify email button, etc.
- API endpoints
- status code & messages for success or error
- Every detail/step of API endpoint like validating data, CRUD method pointing to DB, if-else, etc
  - Avoid rate limiting & throttling in the diagram.
- State of browser, server, database, etc.
- Other important things you may prefer.
- Escape any special character which may break the diagram & Ensure its syntax error free for mermaid diagram.
  - I noticed `()` & `""` are breaking the diagram, so please don't include them.
- Best practices for security, performance, and scalability.
- On error, provide meaningful error message and status code. You can return generic error messages for security reasons.

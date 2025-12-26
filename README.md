# NuxtStart

> Production ready Nuxt.js SaaS boilerplate to launch your SaaS app faster.

## Docker

- Run postgres container:

    ```shell
    docker run --name launchdayone_postgres -e POSTGRES_USER=postgres -e POSTGRES_PASSWORD=adminadmin -e POSTGRES_DB=nuxtstart -p 5432:5432 -v launchdayone_pg_data:/var/lib/postgresql/data -d postgres:17.5-alpine
    ```

- Remove postgres container & volume:

    ```shell
    docker rm -f launchdayone_postgres
    docker volume rm launchdayone_pg_data
    ```

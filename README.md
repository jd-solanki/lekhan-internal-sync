# NuxtStart

> Production ready Nuxt.js SaaS boilerplate to launch your SaaS app faster.

## Docker

- Run postgres container:

    ```shell
    docker run --name nuxtstart_postgres -e POSTGRES_USER=postgres -e POSTGRES_PASSWORD=adminadmin -e POSTGRES_DB=nuxtstart -p 5432:5432 -v nuxtstart_pg_data:/var/lib/postgresql/data -d postgres:17.5-alpine
    ```

- Remove postgres container & volume:

    ```shell
    docker rm -f nuxtstart_postgres
    docker volume rm nuxtstart_pg_data
    ```

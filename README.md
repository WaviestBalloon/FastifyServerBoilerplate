# FastifyServerBoilerplate
A quick and dirty template for when I need to spin up a Fastify project

## Setup

1. Clone repo
2. Install packages with `pnpm i`
3. Run `pnpm dev` or `pnpm prod` to start the server
4. Check out http://localhost:8080/uptime
5. Profit

## Structure

All routes are stored in `src/routes` and are recursively searched then mounted during server initialisation.

Route files take a simple structure: 
- `EndpointConfig` stores the route URL path (`Path`), the HTTP method (`Method`) and a optional ratelimit timeout in milliseconds (`Ratelimit`)
- `run` function will be where the request for this route will be handled

Any exceptions that occur inside the route's code will be caught by the `RequestHandler` and will report the error to the client if possible.

#### Some small footnotes

- Types and shared code are stored in `src/utils/Generic.ts`
- Ratelimit setting, removing and fetching is done in `src/utils/Ratelimit.ts` while `RequestHandler` handles applying and enforcing the ratelimits
- Route exceptions catching, route request handling and ratelimit enforcement is done in `src/utils/RequestHandler.ts`

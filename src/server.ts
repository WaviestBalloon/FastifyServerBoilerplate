import { readdirSync } from "fs";
import path from "path";
import fastify, { type FastifyReply, type FastifyRequest } from "fastify";
import { type EndpointRouteModule } from "./utils/Generic.ts";
import { RequestHandler } from "./utils/RequestHandler.ts";

const __dirname = import.meta.dirname;

const server = fastify({ logger: process.argv.includes("--enablefastifylogger") || false });

console.log("Initalising routes...");
await Promise.all(readdirSync(path.join(__dirname, "routes"), { recursive: true }).map(async (file) => {
	const filename = file.toString();
	if (!filename.endsWith(".ts")) return;

	const route: EndpointRouteModule = await import(path.join(__dirname, "routes", ...filename.split("/")));
	console.log(`Adding ${route.EndpointConfig.Method} route to endpoint ${route.EndpointConfig.Path}...`);
	server.route({
		method: route.EndpointConfig.Method,
		url: `/${route.EndpointConfig.Path}`,
		handler: (request, reply) => {
			RequestHandler(request, reply, route);
		}
	});
}));

console.log("Initalising server hooks...");
server.addHook("onRequest", (request: FastifyRequest, reply: FastifyReply, done) => {
	console.log(`${request.headers["x-forwarded-for"] || request.ip} -> ${request.method} ${request.url}`);
	reply.header("Access-Control-Allow-Origin", "*");
	reply.header("Access-Control-Allow-Methods", "GET");
	done();
});
server.setNotFoundHandler((request: FastifyRequest, reply: FastifyReply) => {
	reply.code(404).send({ error: "Not found" });
});

console.log("Starting backend server...");
server.listen({
	host: "0.0.0.0",
	port: 8080
}, (err) => {
	if (err) throw err;
	console.log(`\nStarted succesfully!`);
});

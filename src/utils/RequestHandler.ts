import type { FastifyReply, FastifyRequest } from "fastify";
import { type EndpointRouteModule } from "./Generic.ts";
import { GetRatelimit, RemoveRatelimit, SetRatelimit } from "./Ratelimit.ts";

export function CleanEndpointURLForForwardfacing(endpointUrl: string): string {
	let split = endpointUrl.split("/");
	split.pop();
	return split.join("/");
}

export async function RequestHandler(request: FastifyRequest, reply: FastifyReply, route: EndpointRouteModule) {
	try {
		const ip: string = request.headers["x-forwarded-for"] as string || request.ip;

		const ratelimitTimer = GetRatelimit(ip, route.EndpointConfig.Path);
		if (ratelimitTimer) {
			return reply.code(429).send({
				error: `You are being ratelimited for this endpoint! Try again in ${((ratelimitTimer - Date.now()) / 1000).toPrecision(2)} seconds...`,
				expires: ratelimitTimer
			});
		}

		SetRatelimit(ip, route.EndpointConfig.Path, Date.now() + route.EndpointConfig.Ratelimit);
		setTimeout(() => {
			RemoveRatelimit(ip, route.EndpointConfig.Path);
			console.log(`Revoked ${route.EndpointConfig.Path} ratelimit for ${ip}`);
		}, route.EndpointConfig.Ratelimit);
		
		await route.run(request, reply);
	} catch (err) {
		reply.type("application/json").code(500).send({
			error: "An exception occured while trying to fulfill the request!",
			exception: `${err}`
		});
		throw err;
	}
}
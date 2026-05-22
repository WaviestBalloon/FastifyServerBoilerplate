import type { FastifyReply, FastifyRequest } from "fastify";
import { type EndpointConfigType } from "../../utils/Generic.ts";
import { uptime } from "process";

export const EndpointConfig: EndpointConfigType = {
	Path: "uptime",
	Method: "GET",
	Ratelimit: 1000
}

export async function run(request: FastifyRequest, reply: FastifyReply) {
	return reply.code(200).send({
		uptime: uptime()
	});
}

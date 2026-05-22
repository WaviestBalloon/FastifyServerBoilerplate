import type { HTTPMethods } from "fastify";
import type { AsyncFunction } from "fastify/types/instance.ts";

export interface EndpointConfigType {
	Path: string,
	Method: HTTPMethods,
	Ratelimit: number,
}

export interface EndpointRouteModule {
	EndpointConfig: EndpointConfigType,
	run: AsyncFunction
}

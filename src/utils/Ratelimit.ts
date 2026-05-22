const ratelimited: Map<string, Map<string, number>> = new Map();

export function GetRatelimit(ip: string, identifier: string): number | null {
	const ratelimitEntry = ratelimited.get(ip);
	if (!ratelimitEntry) return null;

	return ratelimitEntry.get(identifier) || null;
}

export function SetRatelimit(ip: string, identifier: string, expireAtTimestamp: number) {
	let ratelimitEntry = ratelimited.get(ip);
	if (!ratelimitEntry) {
		ratelimitEntry = new Map();
		ratelimited.set(ip, ratelimitEntry);
	}

	ratelimitEntry.set(identifier, expireAtTimestamp);
}

export function RemoveRatelimit(ip: string, identifier: string) {
	let ratelimitEntry = ratelimited.get(ip);
	if (identifier != "*") ratelimitEntry?.delete(identifier);
	if (!ratelimitEntry?.size || identifier == "*") ratelimited.delete(ip);
}

export interface IStatus {
	type:string,
	headers:any,
	status:number,
	statusText:string,
	redirected:boolean
}

export interface IHTTP {
	URL:string,
	body:string,
	response:IStatus
}

export const Text={
	decoder:new TextDecoder("utf-8"),
	encoder:new TextEncoder()
}

export async function request(url:string, options:any): Promise<IHTTP> {
	const response = await fetch(url, options);
	return {
		URL:url,
		body:Text.decoder.decode(new Uint8Array(await response.arrayBuffer())),
		response: {
			type:response.type,
			status:response.status,
			headers:response.headers,
			statusText:response.statusText,
			redirected:response.redirected
		}
	}
}
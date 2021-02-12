import endpoints from "./endpoints.ts";
import {request, IHTTP} from "./http.ts";
import {IDiscordUser} from "./interfaces.ts";
import * as Colors from "https://deno.land/std@0.87.0/fmt/colors.ts";
export const BASE_URL="https://discord.com/api/v7";
export const USER_AGENT="DiscordBot (Discord-Deno, 1.0.0)";
export const discord:any = {
	token:"",
	user:null,
	events:[],
	on:function(name:string,callback:Function){typeof callback==="function"&&this.events.push([name,callback])||null},
	off:function(name:string,callback:Function){
		let rm=[];
		for (let k in this.events) (this.events[k][0]===name&&(callback===undefined||this.events[k][1]===callback))&&rm.push(this.events[k])||null;
		rm.forEach((value:any,key:any)=>this.events.splice(this.events.indexOf(value), 1));
	},
	emit:function(name:string,args:Array<any>) {
		this.events.forEach((value:any, key:any)=>(value[0]===name)&&value[1].call(value[1], ...args)||null);
	},
	request:async function(endpoint:string,options:any){
		const headers = {
			'Authorization':options.token&&options.token||this.token,
			'X-RateLimit-Precision':'millisecond',
			'User-Agent': USER_AGENT
		}
		const baseopts = {
			method: options.method||"GET",
			headers: options.headers&&Object.assign(headers,options.headers)||headers,
		}
		let response:IHTTP=await request(BASE_URL+endpoint, options.base&&Object.assign(baseopts, options.base)||baseopts);
		if(options.json)response.body=JSON.parse(response.body);
		return response;
	},
	login:async function(token:string) {
		const auth = await this.request(endpoints.USER_ME,{token:token, json:true});
		
		if (auth.response.status===200) {
			const id:number=Number(auth.body.id), bot:boolean=auth.body.bot, flags:number=auth.body.flags,
			email:string=auth.body.email, avatar:string=auth.body.avatar, locale:string=auth.body.locale,
			username:string=auth.body.username, verified:boolean=auth.body.verified, mfa_enabled:boolean=auth.body.mfa_enabled,
			public_flags:number=auth.body.public_flags, discriminator:number=Number(auth.body.discriminator);
			const user:IDiscordUser={id,bot,flags,email,avatar,locale,username,verified,mfa_enabled,public_flags,discriminator};
			this.user=user,this.token=token;
		} else console.error(Colors.brightRed("The authentication attempt failed ")+Colors.yellow(auth.URL)+" "+Colors.brightCyan(String(auth.response.status)+": "+auth.response.statusText)+"\n", auth);
	}
};
export default discord;
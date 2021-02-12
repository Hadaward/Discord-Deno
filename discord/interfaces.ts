export interface IDiscordUser {
	id:number,
	bot:boolean,
	flags:number,
	email:string,
	avatar:string,
	locale:string,
	username:string,
	verified:boolean,
	mfa_enabled:boolean,
	public_flags:number,
	discriminator:number,
}
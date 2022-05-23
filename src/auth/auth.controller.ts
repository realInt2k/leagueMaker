import { Controller, Post, Req, Get } from '@nestjs/common';
import { ethers, providers } from 'ethers';
import { Request } from 'express';

@Controller('auth')
export class AuthController {
    @Get("signUp")
    async signUp(@Req() req: Request): Promise<any>
    {
        console.log(req.body);
        const provider:any = req.body;
        try{
            const signer = provider.getSigner();
            const accounts = await provider.send("eth_requestAccounts", []);
        } catch {
            return "signed up failed"
        }
        return "signed up ok";
    }

    @Get("signBS")
    signBS(): string
    {
        return "OK";
    }
}

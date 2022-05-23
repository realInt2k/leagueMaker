import { Controller, Post, Req, Get } from '@nestjs/common';
import { ethers, providers } from 'ethers';
import { Request } from 'express';

@Controller('auth')
export class AuthController {
    @Get("signUp")
    async signUp(@Req() req: Request): Promise<any>
    {
        console.log(req);
        const provider:any = req.body;
        //const signer = provider.getSigner();
        //const accounts = await provider.send("eth_requestAccounts", []);
        return "signed up";
    }

    @Get("signBS")
    signBS(): string
    {
        return "OK";
    }
}

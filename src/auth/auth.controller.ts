import { Controller, Post, Req, Get } from '@nestjs/common';
import { ethers, providers } from 'ethers';
import { Request } from 'express';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
    constructor(
        private authService: AuthService
    )
    {}
    @Get("signin")
    async signin(@Req() req: Request): Promise<any>
    {
        console.log(req.body, req.user);
        const provider:any = req.body;
        try{
            const signer = provider.getSigner();
            const accounts = await provider.send("eth_requestAccounts", []);
            const token = await this.authService.signin(accounts[0]);
            return token;
        } catch {
            return "signed up failed"
        }
    }

    @Get("signBS")
    signBS(): string
    {
        return "OK";
    }
}

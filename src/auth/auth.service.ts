import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as argon from 'argon2';

@Injectable()
export class AuthService {
    constructor(
        private jwt: JwtService,
        private config: ConfigService,
    ){}

    async signup(metamaskAcc: string) {
        // generate the hash
        //const hash = await argon.hash(dto.password);
        // save the new user in the db
        try {
          let user:any;
          return this.signToken(metamaskAcc);
        } catch (error) {
            
        }
      }

    async signToken(
        metamaskAcc: string,
      ): Promise<{ access_token: string }> {
        const payload = {
          sub: metamaskAcc,
        };
        const secret = this.config.get('JWT_SECRET');
        const token = await this.jwt.signAsync(
          payload,
          {
            expiresIn: '2 days',
            secret: secret,
          },
        );
        console.log("in auth.service.ts: ", token);
        return {
          access_token: token,
        };
      }
}

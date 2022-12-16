import { Controller, HttpService, Get, Param, Post, Body, Req, Res, Put } from '@nestjs/common';
import { Request, Response } from 'express';
import { ConfigService } from 'src/config/config.service';
import { ApiBody, ApiHeader, ApiPayloadTooLargeResponse,ApiResponse } from '@nestjs/swagger';

@Controller('jwtToken')
export class JwtTokenController{
    private ruta: string
    jwt = require('jsonwebtoken');
    constructor(
        private readonly httpService: HttpService,        
        ){}   
    
        @ApiBody({
            schema: {
                type: 'object',
                properties: {
                    usuario: { type: 'string', example: 'puertobahia' },
                    contrasena: { type: 'string', example: 'puertobahia2022' },
                }
            }
        })
        @Post()
        @ApiResponse({status: 200, schema: {
            type: 'object',
            properties: {
                statusCode: { type: 'number', example: 200 },
                token: { type: 'string', example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJjaGVjayI6dHJ1ZSwiaWF0IjoxNjU0Nzg4MTU1LCJleHAiOjE2NTQ3ODk1OTV9.a-rs9T8EEHRDfpam0XONqFLZhdYhZ3rpSrJq4mMUflQ' }
            }
        }})
        async autenticar(@Req() req: Request,@Res() res: Response){
            try
            {
                const config = new ConfigService();
                const key = config.get('KEYJWT') || 'KEYPUERTOBAHIA2022';
                if(req.body.usuario === "puertobahia" && req.body.contrasena === "puertobahia2022") 
                {                   
                    const payload = {
                        check:  true
                    };

                    const token = this.jwt.sign(payload, key, {
                        expiresIn: 3600000
                    });
                    
                    return res.status(200).json({statusCOde: 200, token});
                }
                else{
                    return res.status(404).json({statusCOde: 404, description: 'Usuario o contraseña incorrectos'});
                }
            }catch(error){
                    return res.status(500).json({statusCOde: 500, description: 'Usuario o contraseña incorrectos',error});
            }
            
    }

}
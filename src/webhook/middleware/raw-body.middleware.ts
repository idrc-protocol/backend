import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class RawBodyMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    if (req.originalUrl.includes('/webhook/')) {
      console.log('=== RAW WEBHOOK REQUEST ===');
      console.log('Method:', req.method);
      console.log('URL:', req.originalUrl);
      console.log('Content-Type:', req.headers['content-type']);
      console.log('Content-Length:', req.headers['content-length']);
      
      // Log raw body if available
      let body = '';
      req.on('data', (chunk) => {
        body += chunk.toString();
      });
      
      req.on('end', () => {
        console.log('Raw Body:', body);
        console.log('=== END RAW WEBHOOK REQUEST ===');
      });
    }
    next();
  }
}
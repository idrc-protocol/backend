import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable, tap, catchError } from 'rxjs';
import { Request } from 'express';

@Injectable()
export class WebhookLoggingInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest<Request>();
    
    console.log('=== WEBHOOK REQUEST INTERCEPTOR ===');
    console.log('URL:', request.url);
    console.log('Method:', request.method);
    console.log('Headers:', JSON.stringify(request.headers, null, 2));
    console.log('Body:', JSON.stringify(request.body, null, 2));
    console.log('Query:', JSON.stringify(request.query, null, 2));
    console.log('Params:', JSON.stringify(request.params, null, 2));

    return next.handle().pipe(
      tap((response) => {
        console.log('=== WEBHOOK RESPONSE SUCCESS ===');
        console.log('Response:', JSON.stringify(response, null, 2));
        console.log('=== END WEBHOOK SUCCESS ===');
      }),
      catchError((error) => {
        console.log('=== WEBHOOK RESPONSE ERROR ===');
        console.error('Error:', error);
        console.error('Error message:', error.message);
        console.error('Error stack:', error.stack);
        console.log('=== END WEBHOOK ERROR ===');
        throw error;
      }),
    );
  }
}
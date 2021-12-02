import { Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import { AxiosResponse } from 'axios';
@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }
}

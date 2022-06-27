import { Body, Controller, Post } from '@nestjs/common';
import { AppService } from './app.service';
import { RequestRoute } from './interfaces/request';
import { ResponseRoute } from './interfaces/response';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) { }

  @Post("/route")
  async getRoute(@Body() req: RequestRoute): Promise<ResponseRoute> {
    return await this.appService.scanRoute(req);
  }
}

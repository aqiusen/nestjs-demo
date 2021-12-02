import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
  Query,
  UseInterceptors,
} from '@nestjs/common';

import { CatsService } from './cats.service';
import { ForbiddenException } from '../filter/ForbiddenException';
import { LoggingInterceptor } from '../interceptor/LoggingInterceptor';
import { Inject } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
@Controller('cats')
@UseInterceptors(LoggingInterceptor)
export class CatsController {
  constructor(
    @Inject(REQUEST) private request,
    private readonly catsService: CatsService,
  ) {}

  @Get('/')
  getCats() {
    console.log(this.request.url);
    return this.catsService.getCats();
  }

  @Get('/list')
  getList() {
    const list = [];
    for (let i = 0; i < 10; i++) {
      list.push('this is item ' + i);
    }
    return list;
  }

  @Get('/error')
  getException() {
    // throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
    /**
     * 如果传递的response是一个对象，那么返回的就是这个对象
     * {
        "error": "Forbidden",
        "age": 11
       }
     如果返回的是一个字符串：则会把字符串放到message中，然后错误码也返回来
     {
      "statusCode": 403,
      "message": "Forbidden"
      }
     * */
    // throw new HttpException(
    //   { error: 'Forbidden', age: 11 },
    //   HttpStatus.FORBIDDEN,
    // );
    throw new ForbiddenException('ForbiddenException', HttpStatus.BAD_GATEWAY);
  }

  @Get('/:id')
  getInfoById(@Param() params, @Query() { name, age }) {
    console.log(params);
    console.log(name, age);
    return JSON.stringify(params);
  }

  @Post('/save')
  saveData(@Body() body, @Query() params) {
    // success to save{} params ={"name":"zhangsan","age":"22"}
    // 如果选择的不是Params传递值，而是body，那么数据就会在body上
    // success to save{"age":23,"name":"zhangsan1"} params ={}
    return (
      'success to save' +
      JSON.stringify(body) +
      ' params =' +
      JSON.stringify(params)
    );
  }
}

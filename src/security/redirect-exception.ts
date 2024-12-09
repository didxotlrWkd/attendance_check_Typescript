import { HttpException, HttpStatus } from '@nestjs/common';

export class RedirectException extends HttpException {
  constructor(location: string) {
    super(location, HttpStatus.FOUND);
  }
}

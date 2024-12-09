import { Injectable } from '@nestjs/common';
import bcrypt from 'bcrypt';

@Injectable()
export class AdminAuthService {
  constructor(
  ) {}

  async validateUser(id: string, password: string) {
    const admin = (id !== process.env.adminId || password !== process.env.adminPassword) ? false : true;
    if (!admin) {
      return null;
    }
    return admin
  }
}

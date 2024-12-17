import { Controller, Get, Post, Body, Patch, Param, Delete, Render, Res, Redirect, Query, HttpException, UseGuards } from '@nestjs/common';
import { AdminService } from './admin.service';
import { Response } from 'express';
import { editUserDto } from './dto/edit-user.dto';
import { UserResponseDto } from 'src/user/dto/response-user.dto';
import { editEventDto } from './dto/edit-event.dto';
import { AdminLocalAuthGuard } from 'src/security/admin.auth.guard';
import { AdminLoggedInGuard } from 'src/security/admin.logged-in.guard';

@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) { }

  @Get('login')
  @Render('login.html')
  async loginPage() {
  }

  @Post('/login')
  @UseGuards(AdminLocalAuthGuard)
  @Redirect('/admin/userinfo')
  async adminLogin() {
    return
  }

  @Get('logout')
  @UseGuards(AdminLoggedInGuard)
  async logout(@Res() res:Response) {
    res.clearCookie('connect.sid', { httpOnly: true });
    return res.redirect('/admin/login');
  }

  @Get('/userinfo')
  @UseGuards(AdminLoggedInGuard)
  @Render('adminDashboard.html')
  async checkAllUserInfo(): Promise<{ users: UserResponseDto[] }> {
    const users = await this.adminService.checkAllUserInfo();
    return { users }
  }

  @Post('/user/edit/page')
  @UseGuards(AdminLoggedInGuard)
  @Render('userEditPage.html')
  async editUserPage(@Body('user_id') user_id: number): Promise<{ user: editUserDto }> {
    const user = await this.adminService.editUserPage(user_id)
    return { user }
  }

  @Post('/user/edit')
  @UseGuards(AdminLoggedInGuard)
  @Render('adminDashboard.html')
  async editUser(@Body() body: editUserDto): Promise<{ users: UserResponseDto[] }> {
    const users = await this.adminService.editUser(body);
    return { users }
  }

  @Post('/user/delete')
  @UseGuards(AdminLoggedInGuard)
  @Redirect('/admin/userinfo')
  async deleteUserByAdmin(@Body("user_id") user_id: number) {
    return this.adminService.deleteUserByAdmin(user_id);
  }

  @Post('edit/password')
  @UseGuards(AdminLoggedInGuard)
  @Redirect('/admin/userinfo')
  async editUserPassword(
    @Body('password') password: string,
    @Body('user_id') user_id: number
  ) {
    return this.adminService.editUserPassword(password, user_id);
  }

  @Post('/draw/random-user')
  @UseGuards(AdminLoggedInGuard)
  @Render('drawPage.html')
  async drawRandomParticipant(@Body() body): Promise<{ users: UserResponseDto[] }> {
    const users = await this.adminService.drawRandomParticipant(body);
    return { users }
  }

  @Get('/draw/random-user')
  @UseGuards(AdminLoggedInGuard)
  @Render('drawPage.html')
  async drawRandomUserPage() {
    return
  }

  @Get('/draw/random-user/project')
  @UseGuards(AdminLoggedInGuard)
  @Render('drawPageForProject.html')
  async drawRandomUserPageForProjector() {
    return { draw_count: 0 }
  }

  @Post('/draw/random-user/project')
  @UseGuards(AdminLoggedInGuard)
  @Render('drawPageForProject.html')
  async drawRandomUserResultPageForProjector(@Body('draw_count') draw_count: number) {
    return this.adminService.drawRandomUserResultPageForProjector(draw_count);
  }

  @Post('/search/specific-user')
  @UseGuards(AdminLoggedInGuard)
  @Render('adminDashboard.html')
  async searchSpecificUser(@Body('student_code') student_code: string): Promise<{ users: UserResponseDto[] }> {

    const users = await this.adminService.searchSpecificUser(student_code);

    return { users }
  }

  @Get('/events')
  @UseGuards(AdminLoggedInGuard)
  @Render('eventPage.html')
  async searchEvents() {
    const events = await this.adminService.searchEvents();

    return events
  }

  @Get('/event/edit')
  @UseGuards(AdminLoggedInGuard)
  @Render('editEventPage.html')
  async editEventPage(@Query('event_code') event_code: string) {
    const event = await this.adminService.editEventPage(event_code);

    return event
  }

  @Post('/search/id')
  @UseGuards(AdminLoggedInGuard)
  @Render('adminDashboard.html')
  async searchUserById(@Body('user_id') user_id: number): Promise<{ users: UserResponseDto[] }> {
    const user = await this.adminService.searchUserById(user_id);
    return { users: user }
  }

  @Post('/event/edit')
  @UseGuards(AdminLoggedInGuard)
  @Redirect('/admin/events')
  async editEvent(@Body() body: editEventDto) {
    const events = await this.adminService.editEvent(body);

    return events
  }

  @Get('/event/create')
  @UseGuards(AdminLoggedInGuard)
  @Render('addEventPage.html')
  async addEventPage() {
    return
  }

  @Post('/event')
  @UseGuards(AdminLoggedInGuard)
  @Redirect('/admin/events')
  async addEvent(@Body() body: editEventDto) {
    return await this.adminService.addEvent(body);
  }

  @Get('/download/student-info')
  @UseGuards(AdminLoggedInGuard)
  async downloadExcel(@Res() res: Response) {
    try {
      const excelPath = await this.adminService.downloadExcel();
      res.download(excelPath, (err) => {
        if (err) {
          console.error(err);
          throw new HttpException('파일 다운로드에 실패했습니다.', 502);
        }
      });
    }
    catch (err) {
      console.error(err);
      throw new HttpException(err.message, 502);
    }

  }


}

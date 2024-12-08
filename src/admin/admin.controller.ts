import { Controller, Get, Post, Body, Patch, Param, Delete, Render, Res, Redirect, Query } from '@nestjs/common';
import { AdminService } from './admin.service';
import { Response } from 'express';
import { editUserDto } from './dto/edit-user.dto';
import { ResponseUserDto } from 'src/user/dto/response-user.dto';
import { editEventDto } from './dto/edit-event.dto';

@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) { }

  @Get('login')
  @Render('login.html')
  async loginPage() {
  }

  // @Get()
  // @Render('login.html')
  // async mainPage() {
  //   return this.adminService.mainPage();
  // }

  // @Post('login')
  // async adminLogin(@Body() body) {
  //   return this.adminService.adminLogin(body);
  // }

  @Get('/userinfo')
  @Render('adminDashboard.html')
  async checkAllUserInfo() : Promise<{ users: ResponseUserDto[] }> {
      const users = await this.adminService.checkAllUserInfo();
      return {users}
  }

  @Post('/user/edit/page')
  @Render('userEditPage.html')
  async editUserPage(@Body('user_id') user_id : number) : Promise<{ user: editUserDto }>{
    const user = await this.adminService.editUserPage(user_id)
    return {user}
  }

  @Post('/user/edit')
  @Render('adminDashboard.html')
  async editUser(@Body() body : editUserDto) :  Promise<{ users: ResponseUserDto[] }> {
    const users =  await this.adminService.editUser(body);
    return {users}
  }

  @Post('/user/delete')
  @Redirect('/admin/userinfo')
  async deleteUserByAdmin(@Body("user_id") user_id: number) {
    return this.adminService.deleteUserByAdmin(user_id);
  }

  @Post('edit/password')
  @Redirect('/admin/userinfo')
  async editUserPassword(
    @Body('password') password : string,
    @Body('user_id') user_id : number
  ) {
    return this.adminService.editUserPassword(password, user_id);
  }

  @Post('/draw/random-user')
  @Render('drawPage.html')
  async drawRandomParticipant(@Body() body) : Promise<{ users: ResponseUserDto[] }>{
    const users =  await this.adminService.drawRandomParticipant(body);
    return {users}
  }

  @Get('/draw/random-user')
  @Render('drawPage.html')
  async drawRandomUserPage() {
    return
  }

  @Get('/draw/random-user/project')
  @Render('drawPageForProject.html')
  async drawRandomUserPageForProjector() {
    return {draw_count : 0}
  }

  @Post('/draw/random-user/project')
  @Render('drawPageForProject.html')
  async drawRandomUserResultPageForProjector(@Body('draw_count') draw_count : number) {
    return this.adminService.drawRandomUserResultPageForProjector(draw_count);
  }

  @Post('/search/specific-user')
  @Render('adminDashboard.html')
  async searchSpecificUser(@Body('student_code') student_code : string) : Promise<{ users: ResponseUserDto[] }>{

    const users = await this.adminService.searchSpecificUser(student_code);
  
    return {users}
  }

  @Get('/events')
  @Render('eventPage.html')
  async searchEvents() {
    const events =  await this.adminService.searchEvents();

    return events
  }

  @Get('/event/edit')
  @Render('editEventPage.html')
  async editEventPage(@Query('event_code') event_code : string) {
    const event = await this.adminService.editEventPage(event_code);

    return event
  }

  @Post('/search/id')
  @Render('adminDashboard.html')
  async searchUserById(@Body('user_id') user_id : number): Promise<{ users: ResponseUserDto[] }> {
    const user = await this.adminService.searchUserById(user_id);
    return {users : user}
  }

  @Post('/event/edit')
  @Redirect('/admin/events')
  async editEvent(@Body() body : editEventDto) {
    const events = await this.adminService.editEvent(body);

    return events
  }

  // @Get('/event/create')
  // async addEventPage() {
  //   return this.eventService.addEventPage();
  // }

  // @Post('/event')
  // async addEvent(@Body() body) {
  //   return this.eventService.addEvent(body);
  // }

  // @Get('/download/student-info')
  // async downloadExcel() {
  //   return this.adminService.downloadExcel();
  // }

  // @Get('/logout')
  // async logout() {
  //   return this.adminService.logout();
  // }
}

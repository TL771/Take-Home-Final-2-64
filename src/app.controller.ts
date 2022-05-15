import { Controller, Get , Body, Post , Param , Patch,Delete} from '@nestjs/common';
import { AppService } from './app.service';
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Post('booking')
  async book(
    @Body() 
    bookdata:{
      fullname:string , 
      from:string , 
      to:string , 
      triptype:number,
      departure_go:string,
      arrival_go:string,
      departure_back:string,
      arrival_back:string,
      adults:number,
      children:number,
      infants:number
    }
  ):Promise<any>{
    const {triptype,...data} = bookdata;
    if(triptype === 1){
      const check =  await this.appService.count(data.from,data.to,data.departure_go,data.arrival_go);
      if(check && check.left !== 0){
        return this.appService.bookingOneWays(data);
      }
    }else if(triptype === 2){
      const check_go =  await this.appService.count(data.from,data.to,data.departure_go,data.arrival_go);
      const check_back =  await this.appService.count(data.from,data.to,data.departure_back,data.arrival_back);
      if(check_go && check_back && check_go.left !== 0 && check_back !== 0){
        return this.appService.bookingTwoWays(data);
      }
    }
    return 'error';
  }

  @Patch('changedate/:id')
  update(@Param('id') id:string,@Body() updateDate:any) {
    return this.appService.changeDate(id,updateDate.departure,updateDate.arrival);
  }

  @Get('checkSeatBooked/:from/:to/:departure/:arrival')
  async checkSeatBooked(@Param('from') from:string,@Param('to') to:string,@Param('departure') departure:string,@Param('arrival') arrival:string){
    return await this.appService.count(from,to,departure,arrival);
  }

  @Delete('remove/:id')
  async removeTicket(@Param('id') id:string){
    return await this.appService.removeTicketService(id);
  }
}

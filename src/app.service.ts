import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm'
import { Flight } from './entity/flight.entity';
import { FlightDto } from './class/flight-dto';
@Injectable()
export class AppService {
  max:number = 10;
  constructor(
    @InjectRepository(Flight)
    private usersRepository: Repository<Flight>,
  ) {}
  async bookingOneWays(data:FlightDto): Promise<Flight[]>{
    const { departure_go,departure_back,arrival_back, arrival_go ,...dota} = data;
    const a = await this.usersRepository.save({...dota,departure:new Date(Date.parse(departure_go)),arrival:new Date(Date.parse(arrival_go))});
    return [a]
  }
  async bookingTwoWays(data:FlightDto):Promise<Flight[]>{
    const { departure_go,departure_back,arrival_back,from,to, arrival_go ,...dota} = data;
    const a = await this.usersRepository.save({...dota,from,to,departure:new Date(Date.parse(departure_go)),arrival:new Date(Date.parse(arrival_go))});
    const b = await this.usersRepository.save({...dota,to:from,from:to,departure:new Date(Date.parse(departure_back)),arrival:new Date(Date.parse(arrival_back))});
    return [a,b]
  }
  async changeDate(ticket_id:string,departure:string,arrival:string){
    const data_old:Flight = await this.usersRepository.findOne(ticket_id);
    await this.usersRepository.update(ticket_id,{departure:new Date(Date.parse(departure)),arrival:new Date(Date.parse(arrival))});
    const data_new:Flight = await this.usersRepository.findOne(ticket_id);
    return {data_old,data_new}
  }

  async count(from:string,to:string,departure:string,arrival:string):Promise<any>{
    const res = (await this.usersRepository.findAndCount({from,to,departure:new Date(Date.parse(departure)),arrival:new Date(Date.parse(arrival))}))
    return {"Booked" :  res[1],"Left" : this.max -  res[1] , "peopleInFlight":res[0]};
  }

  async removeTicketService(id:string){
    const data:Flight = await this.usersRepository.findOne(id);
    if(data){
      await this.usersRepository.delete(id);
      const {arrival , departure , from , to} = data;
      const res = (await this.usersRepository.findAndCount({from,to,departure,arrival}))
      return {"Booked" : res[1],"Left" : this.max - res[1] , "peopleInFlight":res[0],"remove":data};
    }
    return {error:`dont have ticket_id : ${id}`}
  }
}

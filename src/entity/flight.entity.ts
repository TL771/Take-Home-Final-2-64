import { Entity,Column,PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Flight{
    @PrimaryGeneratedColumn("uuid")
    flight_id:string;

    @Column({type: "varchar",length: 150})
    fullname:string;

    @Column({type: "varchar",length: 150})
    from:string;

    @Column({type: "varchar",length: 150})
    to:string;

    @Column({type: "date"})
    departure:Date;

    @Column({type: "date"})
    arrival:Date;

    @Column()
    adults:number;
    
    @Column()
    children:number;

    @Column()
    infants:number;
}
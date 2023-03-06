import { Entity, Column, PrimaryGeneratedColumn, BaseEntity, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity(
    {
        name: "suppliers"
    }
)
export class Supplier extends BaseEntity {
    
    @PrimaryGeneratedColumn() 
    id : number;

    @Column({ default: '' })
    name : string;    
    
    @Column({ default: '' })
    description : string;
    
    @Column({ default: '' })
    email : string;
              
    @Column({ default: '' })
    phone_number : string;

    @Column({ default: 0 })
    status : number;
    
    @Column({ default: '' })
    created_at : Date; 

    @Column({ default: '' })
    updated_at : Date;  
}
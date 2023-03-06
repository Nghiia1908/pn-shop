import { Entity, Column, PrimaryGeneratedColumn, BaseEntity, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity(
    {
        name: "products"
    }
)
export class Product {

    @PrimaryGeneratedColumn() 
    id : number

    @Column({ default: 0 })
    supplier_id: number

    @Column({ default: '' })
    name : string

    @Column({ default: '' })
    description: string

    @Column({ default: 0 })
    quantity: number

    @Column({ default: 0 })
    amount: number

    @Column({ default: 0 })
    discount_percent: number

    @Column({ default: 0 })
    discount_amount: number

    @Column({ default: 0 })
    status : number

    @Column({ default: '' })
    created_at : Date 

    @Column({ default: '' })
    updated_at : Date 


}
import { Entity, Column, PrimaryGeneratedColumn, BaseEntity, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity()
export class ProductDetailDataModel extends BaseEntity {

    @PrimaryGeneratedColumn() 
    id : number

    @Column({ default: 0 })
    supplier_id: number

    @Column({ default: '' })
    supplier_name : string

    @Column({ default: '' })
    product_name : string

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

    @Column({ default: 0 })
    size : number

    @Column({ default: "" })
    color : string

    @Column("text", { array: true })
    image_urls: string[];

    @Column({ default: '' })
    created_at : Date 

    @Column({ default: '' })
    updated_at : Date 
}
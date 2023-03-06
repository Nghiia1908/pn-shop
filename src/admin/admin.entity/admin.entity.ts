import { Entity, Column, PrimaryGeneratedColumn, BaseEntity, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity(
    {
        name: "admin"
    }
)
export class Admin extends BaseEntity {

    @PrimaryGeneratedColumn()
    id : number;

    @Column({ default: '' })
    first_name : string;

    @Column({ default: '' })
    last_name : string;

    @Column({ default: '' })
    full_name : string;

    @Column({ default: '' })
    email : string;

    @Column({ default: '' })
    phone_number : string;

    @Column({ default: null })
    birthday: Date;

    @Column({ default: '' })
    password : string;

    @Column({ default: '' })
    token : string;

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;

}
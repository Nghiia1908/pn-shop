import { Entity, Column, PrimaryGeneratedColumn, BaseEntity, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity(
    {
        name: "users"
    }
)
export class User extends BaseEntity {

    @PrimaryGeneratedColumn() 
    id : number;

    @Column({ default: '' })
    full_name: string;

    @Column({ default: '' })
    email: string;
    
    @Column({ default: null })
    birthday: Date;

    @Column({ default: '' })
    password: string;

    @Column({ default: '' })
    phone_number: string;

    @Column({ default: '' })
    verify_code : string;

    @UpdateDateColumn()
    is_verify_code_at : Date;

    @Column({ default: '' })
    token: string;

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;


}
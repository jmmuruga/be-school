import { CreateDateColumn, Entity, UpdateDateColumn } from "typeorm";
import { PrimaryGeneratedColumn } from "typeorm";
import { Column } from "typeorm";


@Entity()

export class SchoolMaster {
    @PrimaryGeneratedColumn()
    id: number;
    @Column()
    schoolCode: number
    @Column()
    schoolName: string
    @Column()
    isActive: boolean
    @Column()
    created_UserId: string
    @Column()
    updated_UserId: string
    @CreateDateColumn({ name: "created_at" })
    createdAt: Date;
    @UpdateDateColumn({ name: "updated_at" })
    updatedAt: Date;    
}
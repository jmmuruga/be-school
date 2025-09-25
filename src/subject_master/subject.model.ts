import { CreateDateColumn, Entity, UpdateDateColumn } from "typeorm";
import { PrimaryGeneratedColumn } from "typeorm";
import { Column } from "typeorm";


@Entity()

export class SubjectMaster {
  @PrimaryGeneratedColumn() 
    id: number;
    @Column()
    subjectCode: number
    @Column()
    subjectName: string
    @Column()
    Practical: string
    @Column()
    isActive: boolean
   @Column()
    created_UserId: string
    @Column()
    updated_UserId: string
   @CreateDateColumn({ name: "created_at" })
    createdAt: Date
    @UpdateDateColumn({ name: "updated_at" })
    updatedAt: Date;
}
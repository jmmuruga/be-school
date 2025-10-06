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
    subjectType: string
    @Column()
    selectedClasses: string
    @Column({default:true})
    isActive: boolean
   @Column({nullable:true})
    created_UserId: string
    @Column({nullable:true})
    updated_UserId: string
   @CreateDateColumn({ name: "created_at" })
    createdAt: Date
    @UpdateDateColumn({ name: "updated_at" })
    updatedAt: Date;
}
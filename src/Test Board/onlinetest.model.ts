import { CreateDateColumn } from "typeorm";
import { Entity } from "typeorm";
import { UpdateDateColumn } from "typeorm";
import { PrimaryGeneratedColumn } from "typeorm";
import { Column } from "typeorm";
@Entity()
export class onlinetest {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  subjectName_Id: string;
  @Column()
  TestType: string;
  @Column()
  Numofquestion: number;
  @Column({default:true})
  isActive: Boolean;
   @Column()
  Stream_Id: string;
  @Column()
  StudentLoginId:string;
  @Column({nullable:true})
  created_UserId: string;
  @Column({nullable:true})
  updated_UserId: string;
  @CreateDateColumn({ name: "created_at" })
  createdAt: Date;
  @UpdateDateColumn({ name: "updated_at" })
  updatedAt: Date;
}

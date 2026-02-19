import { Entity } from "typeorm";
import { PrimaryGeneratedColumn } from "typeorm";
import { CreateDateColumn } from "typeorm";
import { UpdateDateColumn } from "typeorm";
import { Column } from "typeorm";
@Entity()
export class studentexamReport {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  Question_Id:string;
  @Column()
  Test_No:string;
  @Column()
  StudentId: string;
  @Column()
  subjectName_Id: string;
  @Column()
  ClassName_Id: string;
  @Column()
  TestType: string;
  @Column()
  NumOfQuestion: string;
  @Column({ default: false })
  Answered: boolean;
  @CreateDateColumn({ name: "created_at" })
  createdAt: Date;
  @UpdateDateColumn({ name: "updated_at" })
  updatedAt: Date;
}

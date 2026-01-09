import { CreateDateColumn } from "typeorm";
import { Entity } from "typeorm";
import { UpdateDateColumn } from "typeorm";
import { PrimaryGeneratedColumn } from "typeorm";
import { Column } from "typeorm";
@Entity()
export class objectiveques {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  ClassName_Id: string;
  @Column()
  subjectName_Id: string;
  @Column()
  type: string;
  @Column()
  Stream_Id:string;
  @Column({ type: "nvarchar", nullable: true, length: "MAX" })
  Imagequestion: string;
  @Column({ nullable: true})
  question: string;
  @Column({ nullable: true })
  optionType: string;

  @Column({ nullable: true })
  option1: string;

  @Column({ nullable: true })
  option2: string;

  @Column({ nullable: true })
  option3: string;

  @Column({ nullable: true })
  option4: string;

  @Column({ nullable: true })
  correctanswer: string;

  @Column({ default: true })
  isActive: Boolean;
  @Column({ nullable: true })
  created_UserId: string;
  @Column({ nullable: true })
  updated_UserId: string;

  @CreateDateColumn({ name: "created_at" })
  createdAt: Date;
  @UpdateDateColumn({ name: "updated_at" })
  updatedAt: Date;
}

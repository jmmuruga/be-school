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
  standard: string;
  @Column()
  subject: string;
  @Column()
  type: string;
  @Column()
  question: string;
  @Column({ type: "ntext", nullable: true })
  studentImage: string;
  @Column()
  optionType: string;
  @Column()
  option1: string;
  @Column()
  option2: string;
  @Column()
  option3: string;
  @Column()
  option4: string;
  @Column()
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

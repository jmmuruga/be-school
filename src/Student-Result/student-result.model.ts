import { Entity } from "typeorm";
import { PrimaryGeneratedColumn } from "typeorm";
import { CreateDateColumn } from "typeorm";
import { UpdateDateColumn } from "typeorm";
import { Column } from "typeorm";

@Entity()
export class studentScoreResult {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  StudentId: string;
  @Column()
  SubjectId: string;
  @Column()
  TestType: string;
  @Column()
  NumOfQuestion: string;
  @Column()
  NoOfAnswered: string;
  @Column()
  NoOfCorrectAnswered: string;
  @Column()
  NoOfWrongAnswered: string;
  @Column()
  Time: string;
  @Column()
  Time_Take: string;
  @CreateDateColumn({ name: "created_at" })
  createdAt: Date;
  @UpdateDateColumn({ name: "updated_at" })
  updatedAt: Date;
}
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";

@Entity()
export class Question {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  standard: string;
  @Column()
  subject: string;
  @Column()
  type: string;
  @Column()
  mark: number;
  @Column()
  question: string;
  @Column({ type: "ntext" })
  studentImage: string;
  @Column()
  FilePath: string;
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

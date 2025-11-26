import { CreateDateColumn } from "typeorm";
import { Entity } from "typeorm";
import { UpdateDateColumn } from "typeorm";
import { PrimaryGeneratedColumn } from "typeorm";
import { Column } from "typeorm";

@Entity()
export class Quesgenerate {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  type: string;
  @Column()
  standard: string;
  @Column()
  subject: string;
  @Column()
  total: number;
  @Column()
  onemark: number;
  @Column()
  optionType: string;
  @Column()
  twomark: number;
  @Column()
  threemark: number;
  @Column()
  fivemark: number;
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

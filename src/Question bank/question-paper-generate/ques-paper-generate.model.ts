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
  scheme: string;
  @Column()
  class: string;
  @Column()
  subject: string;
  @Column()
  total: number;
  @Column()
  isActive: Boolean;
  @Column()
  created_UserId: string;
  @Column()
  updated_UserId: string;
  @CreateDateColumn({ name: "created_at" })
  createdAt: Date;
  @UpdateDateColumn({ name: "updated_at" })
  updatedAt: Date;
}

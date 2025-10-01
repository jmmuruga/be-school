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
  Subject: string;
  @Column()
  TestType: string;
  @Column()
  Numofquestion: number;
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

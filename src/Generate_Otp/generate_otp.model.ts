import { Entity } from "typeorm";
import { PrimaryGeneratedColumn } from "typeorm";
import { CreateDateColumn } from "typeorm";
import { UpdateDateColumn } from "typeorm";
import { Column } from "typeorm";

@Entity()
export class Generate_Otp {
  @PrimaryGeneratedColumn()
  Id: number;
  @Column()
  studentId: number;
  @Column()
  Generate_Otp: number;
  @CreateDateColumn({ name: "created_at" })
  createdAt: Date;
  @UpdateDateColumn({ name: "updated_at" })
  updatedAt: Date;
}

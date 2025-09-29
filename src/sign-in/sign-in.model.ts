import { Entity } from "typeorm";
import { PrimaryGeneratedColumn } from "typeorm";
import { Column } from "typeorm";
import { CreateDateColumn, UpdateDateColumn } from "typeorm";

Entity();
export class SignIn {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  role: string;
  @Column()
  email: string;
  @Column()
  password: string;
  @Column()
  dateOfBirth: Date;
  @Column()
  AdmissionNo: string;
  @Column()
  isActive: boolean;
  @Column()
  created_UserId: string;
  @Column()
  updated_UserId: string;
  @CreateDateColumn({ name: "created_at" })
  createdAt: Date;
  @UpdateDateColumn({ name: "updated_at" })
  updatedAt: Date;
}

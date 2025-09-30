import { Entity } from "typeorm";
import { PrimaryGeneratedColumn } from "typeorm";
import { CreateDateColumn } from "typeorm";
import { UpdateDateColumn } from "typeorm";
import { Column } from "typeorm";

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  UserId: number;
  @Column()
  userName: string;
  @Column()
  password: string;
  @Column()
  confirmPassword: string;
  @Column()
  email: string;
  @Column()
  phone: number;
  @Column()
  roleType: string;
  @Column()
  staffNo: string;
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

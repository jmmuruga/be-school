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
  UserID: number;
  @Column()
  userName: string;
  @Column()
  password: string;
  @Column()
  confirmPassword: string;
  @Column()
  email: string;
  @Column({ type: "nvarchar", length: 15 })
  phone: string;
  @Column()
  roleType: string;
  @Column()
  staffNo: string;
  @Column()
  // userAccess: boolean;
  // @Column()
  // dashboardAccess: boolean;
  // @Column()
  // masterParent: string;
  // @Column()
  // questionsParent: string;
  // @Column()
  // profileParent: string;
  @Column({ default: true })
  isActive: boolean;
  @Column({ default: true })
  status: boolean;
  @Column({ nullable: true })
  created_UserId: string;
  @Column({ nullable: true })
  updated_UserId: string;
  @CreateDateColumn({ name: "created_at" })
  createdAt: Date;
  @UpdateDateColumn({ name: "updated_at" })
  updatedAt: Date;
}

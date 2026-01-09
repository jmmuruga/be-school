import { CreateDateColumn } from "typeorm";
import { Entity } from "typeorm";
import { UpdateDateColumn } from "typeorm";
import { PrimaryGeneratedColumn } from "typeorm";
import { Column } from "typeorm";
@Entity()
export class Signup {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  name: string;
  @Column()
  fatherName: string;
  @Column()
  UserName: string;
  @Column()
  password: string;
  @Column()
  confirmPassword: string;
  @Column()
  email: string;
  @Column({ type: "nvarchar", length: 20 })
  aadhaar: string;
  @Column()
  gender: string;
  @Column()
  dateOfBirth:string;
  @Column()
  address: string;
  @Column()
  Class_Id: string;
  @Column({ type: "nvarchar", nullable: true })
  Stream_Id: string;
  @Column({ type: "nvarchar", nullable: true })
  otherStream: string | null;
  @Column()
  board: string;
  @Column()
  school: string;
  @Column()
  schoolAddress: string;
  @Column({ type: "nvarchar", length: 15 })
  contact: string;
  // @Column({ nullable: true })
  // created_UserId: string;
  @Column({ nullable: true })
  updated_UserId: string;
  @CreateDateColumn({ name: "created_at" })
  createdAt: Date;
  @UpdateDateColumn({ name: "updated_at" })
  updatedAt: Date;
}
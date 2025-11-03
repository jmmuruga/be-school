import { Entity } from "typeorm";
import { PrimaryGeneratedColumn } from "typeorm";
import { CreateDateColumn } from "typeorm";
import { UpdateDateColumn } from "typeorm";
import { Column } from "typeorm";

@Entity()
export class Staff {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  staffNo: number;
  @Column()
  staffName: string;
  @Column()
  Gender: string;
  @Column()
  qualification: string;
  @Column()
  email: string;
  @Column({ type: "nvarchar", length: 15 })
  contactNo: string;
  @Column()
  classOfHandle: string;
  @Column()
  yearOfExperience: string;
  @Column()
  MajorSubject: string;
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

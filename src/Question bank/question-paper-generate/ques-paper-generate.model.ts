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
  onemark:number;
  @Column()
  twomark:number;
  @Column()
  threemark:number;
  @Column()
  fivemark:number;
  @Column({default:true})
  isActive: Boolean;
  @Column({nullable:true})
  created_UserId: string;
  @Column({nullable:true})
  updated_UserId: string;
  @CreateDateColumn({ name: "created_at" })
  createdAt: Date;
  @UpdateDateColumn({ name: "updated_at" })
  updatedAt: Date;
}

import { Entity } from "typeorm";
import { PrimaryGeneratedColumn } from "typeorm";
import { CreateDateColumn } from "typeorm";
import { UpdateDateColumn } from "typeorm";
import { Column } from "typeorm";

@Entity()
export class logs {
  @PrimaryGeneratedColumn()
  logId: number;
  @Column()
  UserId: number;
  @Column({nullable:true})
  UserName: string;
  @Column()
  statusCode: number;
  @Column()
  Message: string;
  @CreateDateColumn({ name: "created_at" })
  createdAt: Date;
  @UpdateDateColumn({ name: "updated_at" })
  updatedAt: Date;
}

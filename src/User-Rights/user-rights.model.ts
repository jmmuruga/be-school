import { Entity } from "typeorm";
import { PrimaryGeneratedColumn } from "typeorm";
import { CreateDateColumn } from "typeorm";
import { UpdateDateColumn } from "typeorm";
import { Column } from "typeorm";
@Entity()
export class UserRight {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  UserRightTypeId: string;
  @Column()
  formCode: string;
  @Column()
  parentId: string;
  @Column()
  formName: string;
  @Column({ nullable: true })
  created_UserId: string;
  @Column({ nullable: true })
  updated_UserId: string;
  @CreateDateColumn({ name: "created_at" })
  createdAt: Date;
  @UpdateDateColumn({ name: "updated_at" })
  updatedAt: Date;
}

import { CreateDateColumn, Entity, UpdateDateColumn } from "typeorm";
import { PrimaryGeneratedColumn } from "typeorm";
import { Column } from "typeorm";

@Entity()
export class GroupMaster {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  groupCode: number;
  @Column()
  className: string;
  @Column()
  groupName: string;
  @Column()
  groupDescription: string;
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

import { CreateDateColumn, Entity, UpdateDateColumn } from "typeorm";
import { PrimaryGeneratedColumn } from "typeorm";
import { Column } from "typeorm";
@Entity()
export class MarkMaster {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  markcode: number;
  @Column()
  mark: number;
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

import { CreateDateColumn, Entity, UpdateDateColumn } from "typeorm";
import { PrimaryGeneratedColumn } from "typeorm";
import { Column } from "typeorm";
@Entity()
export class MediumMaster {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  mediumCode: number;
  @Column()
  medium: string;
  @Column({default:true})
  isActive: boolean;
  @Column({default:true})
  status:boolean;
  @Column({nullable:true})
  created_UserId: string;
  @Column({nullable:true})
  updated_UserId: string;
  @CreateDateColumn({ name: "created_at" })
  createdAt: Date;
  @UpdateDateColumn({ name: "updated_at" })
  updatedAt: Date;
}

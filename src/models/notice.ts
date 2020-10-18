import { Column, Entity, PrimaryColumn, CreateDateColumn } from "typeorm";

@Entity()
export class Notice {
  @PrimaryColumn()
  notice_id: number;

  @Column({ length: 100 })
  content: string;

  @Column({ length: 16 })
  admin_id: string;

  @Column({ length: 20 })
  category: string;

  @CreateDateColumn()
  created_at: Date;
}

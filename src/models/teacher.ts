import { Column, Entity, PrimaryColumn } from "typeorm";

@Entity()
export class Teacher {
  @PrimaryColumn({ length: 16 })
  id: string;

  @Column({ length: 128 })
  pw: string;

  @Column({ length: 12 })
  name: string;

  @Column({ length: 40 })
  office: string;
}

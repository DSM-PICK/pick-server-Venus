import { Column, Entity, PrimaryColumn } from "typeorm";

@Entity()
export class Student {
  @PrimaryColumn({ type: "char", length: 4 })
  num: string;

  @Column({ length: 12 })
  name: string;

  @Column({ length: 20, default: "자습" })
  club_name: string;

  @Column({ length: 20 })
  class_name: string;
}

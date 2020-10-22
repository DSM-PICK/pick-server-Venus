import { Column, Entity, PrimaryColumn } from "typeorm";

@Entity()
export class Club {
  @PrimaryColumn({ length: 20 })
  name: string;

  @Column({ length: 20, unique: true })
  location: string;

  @Column({ length: 10 })
  teacher: string;

  @Column({ length: 12 })
  club_head: string;
}

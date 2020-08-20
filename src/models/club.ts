import { Column, Entity, PrimaryColumn } from "typeorm";

@Entity()
export class Club {
  @PrimaryColumn({ length: 20 })
  name: string;

  @Column({ length: 20, unique: true, nullable: true })
  location: string;
}

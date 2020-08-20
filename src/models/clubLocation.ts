import { Column, Entity, PrimaryColumn } from "typeorm";

@Entity()
export class ClubLocation {
  @PrimaryColumn({ length: 20 })
  location: string;

  @Column()
  floor: number;

  @Column()
  priority: number;
}

import {
  Column,
  Entity,
  PrimaryColumn
} from 'typeorm';

@Entity()
export class Club {
  @PrimaryColumn({ length: 20 })
  name: string;

  @Column()
  floor: number;

  @Column({ length: 20 })
  location: string;

  @Column()
  priority: number;
}
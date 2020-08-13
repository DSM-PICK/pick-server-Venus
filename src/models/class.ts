import {
  Entity,
  Column,
  PrimaryColumn
} from 'typeorm'

@Entity()
export class Class {
  @PrimaryColumn({ length: 20 })
  name: string;

  @Column()
  floor: number;
}
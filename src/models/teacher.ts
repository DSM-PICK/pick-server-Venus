import {
  Entity,
  Column,
  PrimaryColumn
} from 'typeorm'

@Entity()
export class Teacher {
  @PrimaryColumn({ length: 16 })
  id: string;

  @Column({ length: 80 })
  pw: string;

  @Column({ length: 12 })
  name: string;
}
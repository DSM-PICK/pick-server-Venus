import {
  Entity,
  Column,
  PrimaryColumn
} from 'typeorm'

@Entity()
export class Attendance {
  @PrimaryColumn({ type: "date" })
  date: Date;

  @PrimaryColumn({ length: 16 })
  teacher_id: string;

  @PrimaryColumn({ type: "char", length: 4 })
  student_num: string;

  @PrimaryColumn()
  period: number;

  @Column({ type: "char", length: 4 })
  state: string;

  @Column({ length: 40 })
  content: string;
}
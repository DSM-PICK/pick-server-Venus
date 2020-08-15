import {
  Entity,
  Column,
  PrimaryColumn
} from 'typeorm'

@Entity("prior_absence")
export class PriorAbsence {
  @PrimaryColumn()
  id: number;

  @Column({ type: "date" })
  start_date: Date;

  @Column({ type: "date" })
  end_date: Date;

  @Column({ type: "char", length: 4 })
  student_num: string;

  @Column()
  start_period: number;

  @Column()
  end_period: number;
}
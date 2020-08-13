import {
  Entity,
  Column,
  PrimaryColumn
} from 'typeorm'

@Entity("changed_teacher")
export class ChangedTeacher {
  @Column({ length: 16 })
  id: string;

  @Column({ type: "date" })
  date: Date;
}
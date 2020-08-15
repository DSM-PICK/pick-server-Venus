import { Entity, Column, PrimaryColumn } from "typeorm";

@Entity()
export class Activity {
  @PrimaryColumn({ type: "date" })
  date: Date;

  @Column({ length: 28 })
  schedule: string;

  @Column({ length: 16 })
  second_floor_teacher_id: string;

  @Column({ length: 16 })
  third_floor_teacher_id: string;

  @Column({ length: 16 })
  forth_floor_teacher_id: string;
}

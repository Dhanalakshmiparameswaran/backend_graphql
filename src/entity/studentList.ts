import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: "studentList" })
export class StudentList {
  @PrimaryGeneratedColumn("increment")
  id: number;

  @Column({ type: "varchar", nullable: false })
  roll_no: string;

  @Column({ type: "varchar", nullable: false })
  name: string;

  @Column({ type: "varchar", nullable: false })
  classSection: string;

  @Column({ type: "varchar", nullable: false })
  mark: string;
}

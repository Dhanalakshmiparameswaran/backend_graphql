import { Column, Entity } from "typeorm";

@Entity({ name: "studentList" })
export class StudentList {
  @Column({ type: "varchar", length: 255, nullable: false, default: "" })
  role_no!: string;

  @Column({ type: "varchar", length: 255, nullable: false, default: "" })
  name!: string;

  @Column({ type: "varchar", length: 255, nullable: false, default: "" })
  class!: string;
}

import { StudentList } from "../../entity/studentList";
import { AppDataSource } from "../../database";

describe("StudentList Entity", () => {
  beforeAll(async () => {
    await AppDataSource.initialize();
  });

  afterAll(async () => {
    await AppDataSource.destroy();
  });

  it("should create a new StudentList entity", async () => {
    const studentRepo = AppDataSource.getRepository(StudentList);

    const student = new StudentList();
    student.roll_no = "12345";
    student.name = "John Doe";
    student.classSection = "10A";
    student.mark = "85";

    const savedStudent = await studentRepo.save(student);

    expect(savedStudent.id).toBeDefined();
    expect(savedStudent.roll_no).toBe("12345");
    expect(savedStudent.name).toBe("John Doe");
    expect(savedStudent.classSection).toBe("10A");
    expect(savedStudent.mark).toBe("85");
  });
});

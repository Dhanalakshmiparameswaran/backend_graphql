import { AppDataSource } from "./database";
import { StudentList } from "./entity/studentList";

const studentRepository = AppDataSource.getRepository(StudentList);

export const studentRootValue = {
  students: async () => {
    try {
      const students = await studentRepository.find();
      return students;
    } catch (error) {
      console.error("Error fetching students:", error);
      return [];
    }
  },

  addNewRow: async (arg: StudentList) => {
    try {
      const student = studentRepository.create({
        roll_no: arg.roll_no,
        name: arg.name,
        classSection: arg.classSection,
        mark: arg.mark,
      });
      const record = await studentRepository.save(student);
      return record;
    } catch (error) {
      console.error("Error creating the row:", (error as Error).message);
      return null;
    }
  },
  updateRow: async (arg: StudentList) => {
    try {
      const id = arg.id;
      const student = await studentRepository.findOneBy({ id });
      if (!student) {
        console.error("Student not found");
        return null;
      }
      if (arg.roll_no !== undefined) student.roll_no = arg.roll_no;
      if (arg.name !== undefined) student.name = arg.name;
      if (arg.classSection !== undefined)
        student.classSection = arg.classSection;
      if (arg.mark !== undefined) student.mark = arg.mark;
      const updatedStudent = await studentRepository.save(student);
      return updatedStudent;
    } catch (error) {
      console.error("Error updating the row:", (error as Error).message);
      return null;
    }
  },

  deleteRow: async (arg: StudentList) => {
    try {
      const id = arg.id;
      const student = await studentRepository.findOneBy({ id });
      if (!student) {
        console.error("Student not found");
        return null;
      }
      await studentRepository.remove(student);
      return { message: "Student deleted successfully" };
    } catch (error) {
      console.error("Error deleting the row:", (error as Error).message);
      return null;
    }
  },
};

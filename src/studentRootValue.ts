import bcrypt from "bcrypt";
import { AppDataSource } from "./database";
import { StudentList } from "./entity/studentList";
import { User } from "./entity/user";

const studentRepository = AppDataSource.getRepository(StudentList);
const userRepository = AppDataSource.getRepository(User);

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

  addNewRow: async (args: {
    roll_no: string;
    name: string;
    classSection: string;
    mark: string;
  }) => {
    try {
      const student = studentRepository.create(args);
      const record = await studentRepository.save(student);
      return record;
    } catch (error) {
      console.error("Error creating the row:", error);
      return null;
    }
  },

  updateRow: async (args: {
    id: number;
    roll_no?: string;
    name?: string;
    classSection?: string;
    mark?: string;
  }) => {
    try {
      const student = await studentRepository.findOneBy({ id: args.id });
      if (!student) {
        console.error("Student not found");
        return null;
      }
      if (args.roll_no !== undefined) student.roll_no = args.roll_no;
      if (args.name !== undefined) student.name = args.name;
      if (args.classSection !== undefined)
        student.classSection = args.classSection;
      if (args.mark !== undefined) student.mark = args.mark;
      const updatedStudent = await studentRepository.save(student);
      return updatedStudent;
    } catch (error) {
      console.error("Error updating the row:", error);
      return null;
    }
  },

  deleteRow: async (args: { id: number }) => {
    try {
      const student = await studentRepository.findOneBy({ id: args.id });
      if (!student) {
        console.error("Student not found");
        return null;
      }
      await studentRepository.remove(student);
      return { message: "Student deleted successfully" };
    } catch (error) {
      console.error("Error deleting the row:", error);
      return null;
    }
  },

  signup: async (args: {
    email: string;
    password: string;
    role: "STUDENT" | "TEACHER";
  }) => {
    try {
      const { email, password, role } = args;
      console.log("Signup args:", email, password, role);

      if (!email || !password) {
        throw new Error("Email and password are required");
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const user = userRepository.create({
        email,
        password: hashedPassword,
        role,
      });

      const newUser = await userRepository.save(user);

      return { id: newUser.id, email: newUser.email, role: newUser.role };
    } catch (error) {
      console.error("Error signing up:", error);
      return null;
    }
  },
  login: async (args: { email: string; password: string }) => {
    try {
      const { email, password } = args;

      console.log("Login args:", args);

      const user = await userRepository.findOneBy({ email });
      if (!user || !(await bcrypt.compare(password, user.password))) {
        throw new Error("Invalid credentials");
      }
      return { id: user.id, email: user.email, role: user.role };
    } catch (error) {
      console.error("Error logging in:", error);
      return null;
    }
  },
};

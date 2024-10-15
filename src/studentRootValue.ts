import bcrypt from "bcrypt";
import jwt from "jsonwebtoken"; 
import { AppDataSource } from "./database";
import { StudentList } from "./entity/studentList";
import { User } from "./entity/user";

const JWT_SECRET = process.env.JWT_SECRET || "default_secret"; 
const studentRepository = AppDataSource.getRepository(StudentList);
const userRepository = AppDataSource.getRepository(User);

export const studentRootValue = {
  students: async () => {
    try {
      return await studentRepository.find();
    } catch (error) {
      throw new Error("Error fetching students: " + error);
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
      return await studentRepository.save(student);
    } catch (error) {
      throw new Error("Error creating the row: " + error);
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
        throw new Error("Student not found");
      }
      Object.assign(student, args);  // Using Object.assign for clean updates
      return await studentRepository.save(student);
    } catch (error) {
      throw new Error("Error updating the row: " + error);
    }
  },

  deleteRow: async (args: { id: number }) => {
    try {
      const student = await studentRepository.findOneBy({ id: args.id });
      if (!student) {
        throw new Error("Student not found");
      }
      await studentRepository.remove(student);
      return { message: "Student deleted successfully" };
    } catch (error) {
      throw new Error("Error deleting the row: " + error);
    }
  },

  signup: async (args: {
    name: string;  // Using primitive type
    email: string;
    password: string;
    role: "STUDENT" | "TEACHER";
  }) => {
    try {
      const { name, email, password, role } = args;
      if (!email || !password || !name) {
        throw new Error("Email, name, and password are required");
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const user = userRepository.create({ name, email, password: hashedPassword, role });

      const newUser = await userRepository.save(user);
      const token = jwt.sign(
        { id: newUser.id, name: newUser.name, email: newUser.email, role: newUser.role },
        JWT_SECRET,
        { expiresIn: "1h" } 
      );

      return { id: newUser.id, name: newUser.name, email: newUser.email, role: newUser.role, token };
    } catch (error) {
      throw new Error("Error signing up: " + error);
    }
  },

  signIn: async (args: { email: string; password: string }) => {
    try {
      const { email, password } = args;
      const user = await userRepository.findOneBy({ email });
      if (!user) {
        throw new Error("User not found");
      }

      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        throw new Error("Invalid credentials");
      }

      const token = jwt.sign(
        { id: user.id, email: user.email, role: user.role },
        JWT_SECRET,
        { expiresIn: "1h" }
      );

      return { id: user.id, email: user.email, role: user.role, token };
    } catch (error) {
      throw new Error("Error logging in: " + error);
    }
  },
};

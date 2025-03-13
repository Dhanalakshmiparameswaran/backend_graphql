
import { studentRepository, studentRootValue, userRepository } from "../studentRootValue";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken"; 

jest.mock("bcrypt", () => ({
  hash: jest.fn(),
  compare:jest.fn(),
}));

jest.mock("jsonwebtoken", () => ({
  sign: jest.fn(),
}));

jest.mock("../database", () => ({
  AppDataSource: {
    getRepository: jest.fn().mockReturnValue({
      find: jest.fn(),
      findOneBy: jest.fn(),
      create: jest.fn(),
      save: jest.fn(),
      remove: jest.fn(),
    }),
  },
}));

describe("students", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  
  it("should throw an error when fetching students fails", async () => {
    const errorMessage = "Error fetching students";
    (studentRepository.find as jest.Mock).mockRejectedValue(
      new Error(errorMessage)
    );
  
    await expect(studentRootValue.students()).rejects.toThrow();
    expect(studentRepository.find).toHaveBeenCalledTimes(1);
  });
  it("should return students successfully", async () => {
    const mockStudents = [
      { id: 1, name: "John Doe" },
      { id: 2, name: "Jane Smith" },
    ];
    (studentRepository.find as jest.Mock).mockResolvedValue(mockStudents);

    const result = await studentRootValue.students();

    expect(result).toEqual(mockStudents);
  });

});

describe("addNewRow", () => {

  beforeEach(() => {
    jest.clearAllMocks();
  });

    it("should create and save a new student successfully", async () => {
    const args = {
      roll_no: '12345',
      name: 'John Doe',
      classSection: 'A1',
      mark: '90',
    };
    
    const mockStudent = { id: 1, ...args };
    (studentRepository.create as jest.Mock).mockReturnValue(mockStudent); 
    (studentRepository.save as jest.Mock).mockResolvedValue(mockStudent);

    const result = await studentRootValue.addNewRow(args);

    expect(studentRepository.create).toHaveBeenCalledWith(args);
    expect(studentRepository.save).toHaveBeenCalledWith(mockStudent);
    expect(result).toEqual(mockStudent);
  });

  it("should throw an error if creating the row fails", async () => {
    const args = {
      roll_no: '12345',
      name: 'John Doe',
      classSection: 'A1',
      mark: '90',
    };

    (studentRepository.create as jest.Mock).mockReturnValue(args);
    (studentRepository.save as jest.Mock).mockRejectedValue(new Error('Database error'));

    await expect(studentRootValue.addNewRow(args)).rejects.toThrow("Error creating the row: Error: Database error");
    expect(studentRepository.create).toHaveBeenCalledWith(args);
    expect(studentRepository.save).toHaveBeenCalledWith(args);
  });
});

describe("updateRow", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  
  it("should throw an error if student is not found", async () => {
    const args = { id: 999, name: "Non Existent", roll_no: "000", classSection: "X1", mark: "50" };
  
    (studentRepository.findOneBy as jest.Mock).mockResolvedValue(null);
    await expect(studentRootValue.updateRow(args)).rejects.toThrow("Error updating the row: Error: Student not found");
    expect(studentRepository.save).not.toHaveBeenCalled();
    expect(studentRepository.findOneBy).toHaveBeenCalledWith({ id: args.id });
  });
  
  
  it("should update an existing student successfully", async () => {
    const args = {
      id: 1,
      name: "John Updated",
      roll_no: "12345",
      classSection: "B1",
      mark: "95",
    };

    const existingStudent = { id: 1, name: "John Doe", roll_no: "12345", classSection: "A1", mark: "90" };

    (studentRepository.findOneBy as jest.Mock).mockResolvedValue(existingStudent);
    (studentRepository.save as jest.Mock).mockResolvedValue({ ...existingStudent, ...args });

    const result = await studentRootValue.updateRow(args);

    expect(studentRepository.findOneBy).toHaveBeenCalledWith({ id: args.id });
    expect(studentRepository.save).toHaveBeenCalledWith({ ...existingStudent, ...args });
    expect(result).toEqual({ ...existingStudent, ...args });
  });

  it("should throw an error if saving the updated student fails", async () => {
    const args = { id: 1, name: "John Updated", roll_no: "12345", classSection: "B1", mark: "95" };

    const existingStudent = { id: 1, name: "John Doe", roll_no: "12345", classSection: "A1", mark: "90" };

    (studentRepository.findOneBy as jest.Mock).mockResolvedValue(existingStudent);
    (studentRepository.save as jest.Mock).mockRejectedValue(new Error('Database error'));

    await expect(studentRootValue.updateRow(args)).rejects.toThrow("Error updating the row: Error: Database error");

    expect(studentRepository.findOneBy).toHaveBeenCalledWith({ id: args.id });
    expect(studentRepository.save).toHaveBeenCalledWith({ ...existingStudent, ...args });
  });
});

describe('deleteRow', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  
  it('should throw an error if student is not found', async () => {
    const args = { id: 999 };
    (studentRepository.findOneBy as jest.Mock).mockResolvedValue(null);
    
    await expect(studentRootValue.deleteRow(args)).rejects.toThrow("Error deleting the row: Error: Student not found");

    expect(studentRepository.remove).not.toHaveBeenCalled();
    expect(studentRepository.findOneBy).toHaveBeenCalledWith({ id: args.id });
  });
  it('should delete a student successfully if found', async () => {
    const args = { id: 1 };
    const mockStudent = { id: 1, name: "John Doe" };

    (studentRepository.findOneBy as jest.Mock).mockResolvedValue(mockStudent);
    (studentRepository.remove as jest.Mock).mockResolvedValue(mockStudent);

    const result = await studentRootValue.deleteRow(args);

    expect(studentRepository.findOneBy).toHaveBeenCalledWith({ id: args.id });
    expect(studentRepository.remove).toHaveBeenCalledWith(mockStudent);
    expect(result).toEqual({ message: "Student deleted successfully" });
  });
});
describe("signup", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should sign up a new user and return a token", async () => {
    const mockUser = {
      id: 1,
      name: "Jane Doe",
      email: "jane.doe@example.com",
      role: "STUDENT",
    };

    const hashedPassword = "hashedPassword";
    const token = "mockJwtToken";

    (bcrypt.hash as jest.Mock).mockResolvedValue(hashedPassword);

    (userRepository.create as jest.Mock).mockReturnValue(mockUser);
    (userRepository.save as jest.Mock).mockResolvedValue(mockUser);

    (jwt.sign as jest.Mock).mockReturnValue(token);

    const result = await studentRootValue.signup({
      name: "Jane Doe",
      email: "jane.doe@example.com",
      password: "password123",
      role: "STUDENT", 
    });

    expect(bcrypt.hash).toHaveBeenCalledWith("password123", 10);
    expect(userRepository.create).toHaveBeenCalledWith({
      name: "Jane Doe",
      email: "jane.doe@example.com",
      password: hashedPassword,
      role: "STUDENT",
    });
    expect(userRepository.save).toHaveBeenCalledWith(mockUser);
    expect(jwt.sign).toHaveBeenCalledWith(
      { id: 1, name: "Jane Doe", email: "jane.doe@example.com", role: "STUDENT" },
      process.env.JWT_SECRET || "default_secret",
      { expiresIn: "1h" }
    );

    expect(result).toEqual({
      id: 1,
      name: "Jane Doe",
      email: "jane.doe@example.com",
      role: "STUDENT",
      token,
    });
  });

  it("should throw an error if email, name, or password is missing", async () => {
    await expect(
      studentRootValue.signup({
        name: "Jane Doe",
        email: "",
        password: "password123",
        role: "STUDENT",
      })
    ).rejects.toThrow("Email, name, and password are required");

    await expect(
      studentRootValue.signup({
        name: "",
        email: "jane.doe@example.com",
        password: "password123",
        role: "STUDENT",
      })
    ).rejects.toThrow("Email, name, and password are required");

    await expect(
      studentRootValue.signup({
        name: "Jane Doe",
        email: "jane.doe@example.com",
        password: "",
        role: "STUDENT",
      })
    ).rejects.toThrow("Email, name, and password are required");
  });
});

describe("signIn", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should log in a user and return a token when credentials are correct", async () => {
    const mockUser = {
      id: 1,
      email: "jane.doe@example.com",
      password: "hashedPassword",
      role: "STUDENT",
    };

    const password = "password123";
    const token = "mockJwtToken";

    (bcrypt.compare  as jest.Mock).mockResolvedValue(true);

    userRepository.findOneBy = jest.fn().mockResolvedValue(mockUser);

    jwt.sign = jest.fn().mockReturnValue(token);

    const result = await studentRootValue.signIn({
      email: "jane.doe@example.com",
      password,
    });

    expect(userRepository.findOneBy).toHaveBeenCalledWith({ email: "jane.doe@example.com" });
    expect(bcrypt.compare).toHaveBeenCalledWith(password, mockUser.password);
    expect(jwt.sign).toHaveBeenCalledWith(
      { id: 1, email: "jane.doe@example.com", role: "STUDENT" },
      process.env.JWT_SECRET || "default_secret",
      { expiresIn: "1h" }
    );

    expect(result).toEqual({
      id: 1,
      email: "jane.doe@example.com",
      role: "STUDENT",
      token,
    });
  });

  it("should throw an error if user is not found", async () => {
    userRepository.findOneBy = jest.fn().mockResolvedValue(null);

    await expect(
      studentRootValue.signIn({
        email: "jane.doe@example.com",
        password: "password123",
      })
    ).rejects.toThrow("User not found");
  });

  it("should throw an error if password is incorrect", async () => {
    const mockUser = {
      id: 1,
      email: "jane.doe@example.com",
      password: "hashedPassword",
      role: "STUDENT",
    };

    userRepository.findOneBy = jest.fn().mockResolvedValue(mockUser);
    (bcrypt.compare as jest.Mock).mockResolvedValue(false);

    await expect(
      studentRootValue.signIn({
        email: "jane.doe@example.com",
        password: "wrongPassword",
      })
    ).rejects.toThrow("Invalid credentials");
  });

  it("should throw an error if an unexpected error occurs", async () => {
    userRepository.findOneBy = jest.fn().mockRejectedValue(new Error("Database error"));

    await expect(
      studentRootValue.signIn({
        email: "jane.doe@example.com",
        password: "password123",
      })
    ).rejects.toThrow("Error logging in: Error: Database error");
  });
});

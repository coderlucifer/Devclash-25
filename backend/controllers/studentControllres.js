import { Student } from "../Schema/studentSchema.js";
import { z } from "zod";
import bcrypt from "bcrypt"
import jwt  from "jsonwebtoken";



const studentZod = z.object({
    firstName: z.string().min(2, "Firstname must be at least 2 characters"),
    lastName: z.string().min(2, "Lastname must be at least 2 characters"),
    email: z.string().email("Invalid email format"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    Board: z.string(),
    std: z.number(),
    duelRating: z.number().optional(),
    testRating: z.number().optional(),
    testCompleted: z.number().optional()
});

export async function studentSignup(req, res) {

    const { firstName, lastName, email, password, Board,std, duelRating, testRating,testCompleted} = req.body;

    //Validate request body using Zod
    const validation = studentZod.safeParse({ firstName, lastName, email, password, Board,std, duelRating, testRating,testCompleted});
    console.log("logging validation : ",validation);

    if (!validation.success) {
        return res.status(400).json({
            msg: "Invalid details for signup",
            errors: validation.error.errors[0].message
        });
    }
    console.log("logging validation data : ",validation.data);
    // console.log("hello");

    const hashedpassword = await bcrypt.hash(password,10);

    try {
        // Check if user already exists
        const isAlreadyPresent = await Student.findOne({ email });
        if (isAlreadyPresent) {
            return res.status(201).json({
                message:  "User with this email already exists"
            });
        }

        // Create new user
        await Student.create({ firstName, lastName, email, password : hashedpassword, Board, std, duelRating, testRating,testCompleted});

        return res.status(201).json({
            msg: "Student signup created successfully"
        });

    } catch (e) {
        return res.status(500).json({
            error: e.message || "Internal Server Error"
        });
    }
}

export async function studentSignin(req, res) {
    const loginSchema = z.object({
      email: z.string().email("Invalid email format"),
      password: z.string().min(6, "Password must be at least 6 characters"),
    });
  
    const validation = loginSchema.safeParse(req.body);
    if (!validation.success) {
      return res.status(400).json({
        message: "Invalid login details",
        errors: validation.error.errors[0].message,
      });
    }
  
    const { email, password } = validation.data;
  
    try {
      const student = await Student.findOne({ email });
      if (!student) {
        return res.status(404).json({ message: "No student found" });
      }
  
      const isMatch = await bcrypt.compare(password, student.password);
      if (!isMatch) {
        return res.status(401).json({ message: "Incorrect password" });
      }
  
      const token = jwt.sign(
        { studentId: student._id },
        process.env.JWT_SECRET,
        { expiresIn: "1d" }
      );
  
      res.status(200).json({
        message: "Login successful",
        student,
        token,
      });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
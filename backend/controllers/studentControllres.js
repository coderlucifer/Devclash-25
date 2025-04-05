// studentController.js
import { Student } from "../Schema/studentSchema.js";
import { z } from "zod";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

// ------------------ SIGNUP ------------------

export async function studentSignup(req, res) {
  const studentZod = z.object({
    firstName: z.string().min(2, "Firstname must be at least 2 characters"),
    lastName: z.string().min(2, "Lastname must be at least 2 characters"),
    email: z.string().email("Invalid email format"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    std: z.number(),
    Board: z.string(),
    duelRating: z.number(),
    testRating: z.number(),
  });

  const validation = studentZod.safeParse(req.body);
  if (!validation.success) {
    return res.status(400).json({
      msg: "Invalid details for signup",
      errors: validation.error.errors[0].message,
    });
  }

  const {
    firstName,
    lastName,
    email,
    password,
    std,
    Board,
    duelRating,
    testRating,
  } = validation.data;

  try {
    const existing = await Student.findOne({ email });
    if (existing) {
      return res.status(409).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await Student.create({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      std,
      Board,
      duelRating,
      testRating,
    });

    res.status(201).json({ msg: "Student registered successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

// ------------------ SIGNIN ------------------

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

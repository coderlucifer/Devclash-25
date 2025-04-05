import { Student } from "../Schema/studentSchema.js";
import { z } from "zod";
import bcrypt from "bcrypt"
// import jwt from "jsonwebtoken"
// import { jwtKey } from "../config.js";


// const userZod = z.object({
//     firstName: z.string().min(2, "Firstname must be at least 2 characters"),
//     lastName: z.string().min(2, "Lastname must be at least 2 characters"),
//     email: z.string().email("Invalid email format"),
//     password: z.string().min(6, "Password must be at least 6 characters")
// });

export async function studentSignup(req, res) {

    const { firstName, lastName, email, password, Board, duelRating, testRating} = req.body;

    // Validate request body using Zod
    // const validation = userZod.safeParse({ firstName, lastName, email, password });
    // console.log(validation);

    // if (!validation.success) {
    //     return res.status(400).json({
    //         msg: "Invalid details for signup",
    //         errors: validation.error.errors[0].message
    //     });
    // }
    // console.log(validation.data);
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
        await Student.create({ firstName, lastName, email, password : hashedpassword, Board, duelRating, testRating});

        return res.status(201).json({
            msg: "Student signup created successfully"
        });

    } catch (e) {
        return res.status(500).json({
            error: e.message || "Internal Server Error"
        });
    }
}

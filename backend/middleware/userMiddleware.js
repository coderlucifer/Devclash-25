import jwt from "jsonwebtoken";


export default async function userMiddleware(req,res,next){
    try{
        const authHeader=req.headers.authorization;
        if(!authHeader || !authHeader.startsWith("Bearer ")){
            return res.status(401).json({message:"Unauthorized- Token not provided"});
        }
        const token=authHeader.split(" ")[1];
        const JWT_SECRET=process.env.JWT_SECRET;
        const decoded=jwt.verify(token,JWT_SECRET);
        // const student=await Student.findOne({
        //     _id:decoded.studentId
        // })
        // if(!student){
        //     return res.status(401).json({message:"Unauthorized- Student not found"});
        // }
        if(!decoded){
            return res.status(401).json({message:"Unauthorized- Invalid token"});
        }
        req.studentId=decoded.studentId;
        next();
    }catch(e){
        //console.log("Error in userMiddleware",e.message);
        return res.status(500).json({error:e.message || "Internal Server Error"});
    }
}


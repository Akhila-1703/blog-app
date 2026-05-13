import { UserTypeModel } from "../models/UserModel.js";
export const checkUser=async(req,res,next)=>{
    //get author id and 
    let aid=req.body?.user || req.params.userId 
    //verify author
    const user = await UserTypeModel.findById(aid);
    //if author not found
    if(!user){
        return res.status(401).json({message:"user not found"})
    }
    //if author found but role is diffrenet
    if(user.role!=="USER"){
        return res.status(403).json({message:"NOT a User"})
    }
    //if author blocked
    if(!user.isActive){
        return res.status(403).json({message:"User account is not active"})
    }
//forward req to next
    next()
}
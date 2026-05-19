import bcrypt from "bcryptjs"
import jwt from 'jsonwebtoken'
import { UserTypeModel } from "../models/UserModel.js"

// register function
export const register = async (userObj) => {

    // Create document
    const userDoc = new UserTypeModel(userObj)

    // validate from empty passwords
    await userDoc.validate()

    // hash and replace plain password
    userDoc.password = await bcrypt.hash(userDoc.password, 10)

    // save
    const created = await userDoc.save()

    // convert document to object to remove password
    const newUserObj = created.toObject()

    // remove password
    delete newUserObj.password

    // return user obj without password
    return newUserObj;
}

// authenticate function
export const authenticate = async ({ email, password }) => {

    // check user with email
    const user = await UserTypeModel.findOne({ email })

    if (!user) {
        const err = new Error("Invalid email")
        err.status = 401
        throw err
    }

    // compare password
    const isMatch = await bcrypt.compare(password, user.password)

    if (!isMatch) {
        const err = new Error("Invalid Password")
        err.status = 401
        throw err
    }

    // check isActive
    if (user.isActive === false) {
        const err = new Error("your account is blocked. plz contact Admin")
        err.status = 403
        throw err
    }

    // generate token
    const token = jwt.sign(
        {
            _id: user._id,
            firstName: user.firstName,
            lastName: user.lastName,
            role: user.role,
            email: user.email,
            profileImageUrl: user.profileImageUrl
        },
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
    )

    // remove password before sending
    const userObj = user.toObject()

    delete userObj.password

    return { token, user: userObj }

}
import jwt from "jsonwebtoken"
import { prisma } from "../database/db.js"
import dotenv from "dotenv"
import bcrypt from "bcrypt"

dotenv.config()

const DEFAULT_SECRET_KEY = "JS"

export class Authentication{
    /**
     * 
     * @param {string} email 
     * @param {string} password
     * 
     * @returns {Promise<string|null>}
     */
    static async auth(email, password){
        const user = await prisma.user.findFirst({
            where: {
                email
            }
        })

        if(!user){
            return false
            // Harusnya Throw Error
        }

        if(!(await bcrypt.compare(password, user.password))){
            return false
            // Harusnya Throw Error
        }

        const token = this.jwtSign(user.id)
        return token        
    }

    /**
     * 
     * @param {string} userId
     * 
     * @returns {string}
     */

    static jwtSign(id){
        const token = jwt.sign(
            {id}, 
            process.env.JWT_SECRET || DEFAULT_SECRET_KEY, 
            { algorithm: "HS256", expiresIn: "24h" }
        )

        return token
    }

    /**
     * 
     * @param {string} token 
     */
    static jwtVerify(token){
        const decoded = jwt.verify(token, process.env.JWT_SECRET || DEFAULT_SECRET_KEY)

        return decoded
    }
}
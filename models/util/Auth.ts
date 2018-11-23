
import {Jwt} from "./Jwt"
export interface AuthSchema{
    required: Jwt,
    optional?: Jwt
}

export class Auth implements AuthSchema{
    required: any
    optional?: any
    constructor(objAuth){
        Object.assign(this, objAuth)
    }
}

export default Auth
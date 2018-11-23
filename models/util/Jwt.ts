export interface JwtSchema{
    secret: string,
    userProperty: string,
    getToken: any | null,
    credentialsRequired?: boolean,
}

export class Jwt implements JwtSchema{
    secret: string
    userProperty: string
    getToken: any | null
    credentialsRequired?: boolean
    
    constructor(objJwt){
        Object.assign(this, objJwt)
    }
}
export default Jwt
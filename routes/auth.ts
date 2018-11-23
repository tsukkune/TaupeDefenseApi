import * as jwt from "express-jwt";
import {Auth} from "../models/util/Auth"
import {Jwt} from "../models/util/Jwt"
const getTokenFromHeaders : any | null = (req : any) => {
  const { headers: { authorization } } : any = req;

  if(authorization && authorization.split(' ')[0] === 'Token') {
    return authorization.split(' ')[1];
  }
  return null;
};

const required : Jwt = new Jwt({
  secret: 'secret',
  userProperty: 'payload',
  getToken: getTokenFromHeaders,
})
const optional : Jwt = new Jwt({
  secret: 'secret',
  userProperty: 'payload',
  getToken: getTokenFromHeaders,
  credentialsRequired: false,
})

const auth : Auth = new Auth({
  required: jwt(required),
  optional: jwt(optional),
});

export default auth;
import {Router} from "express";
const router : Router = Router();

router.use('/users', require('./users'));

export default router;
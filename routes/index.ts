
import * as express from "express"
import * as api from "./api"

const router : express.Router = express.Router();
router.use('/api', api);

export default router;
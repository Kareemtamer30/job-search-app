import {Router} from 'express';
import {authenticate} from "../../middlewares/authentication.js";
import {authorize} from "../../middlewares/authorization.js";
import * as adminService from "../admin/admin.services.js";
import {approveCompanySchema, banUserSchema} from "./admin.validation.js";
import {validation} from "../../middlewares/validation.js";
const router = Router();



router.put("/ban-User",authenticate,authorize(["admin"]),validation(banUserSchema),adminService.banUser);

router.put("/approve-company", authenticate, authorize(["admin"]), validation(approveCompanySchema), adminService.approveCompany);


export default router;
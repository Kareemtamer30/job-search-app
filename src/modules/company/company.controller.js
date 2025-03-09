import {Router} from 'express';
import multer from "multer";
import * as companyServices from"./company.services.js"
import {authenticate} from "../../middlewares/authentication.js";
import {validation} from "../../middlewares/validation.js";
import {addCompanySchema, updateCompanySchema} from "./company.validation.js";
const router = Router();
const upload = multer({ dest: "uploads/" });

router.post("/addCompany",authenticate,validation(addCompanySchema),companyServices.addCompany)
router.put("/updateCompany/:companyId",authenticate,validation(updateCompanySchema),companyServices.updateCompany)
router.delete("/soft-delete/:companyId",authenticate,companyServices.softDeleteCompany)
router.get("/:companyId/jobs", authenticate, companyServices.getCompanyWithJobs);
router.get("/search", authenticate, companyServices.searchCompanyByName);
router.post("/:companyId/upload-logo", authenticate, upload.single("logo"), companyServices.uploadCompanyLogo);
router.post("/:companyId/upload-cover-pic", authenticate, upload.single("coverPic"), companyServices.uploadCompanyCoverPic);
router.delete("/:companyId/delete-logo", authenticate, companyServices.deleteCompanyLogo);
router.delete("/:companyId/delete-cover-pic", authenticate, companyServices.deleteCompanyCoverPic);


export default router;
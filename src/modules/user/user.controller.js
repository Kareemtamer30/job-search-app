import {Router} from "express"
import * as  userService from "./user.services.js"
import { validation } from "../../middlewares/validation.js";
import {authenticate} from "../../middlewares/authentication.js";
import {updatePasswordSchema, updateUserAccountSchema} from "./user.validation.js";
const router=Router();


router.put("updateuser",authenticate,validation(updateUserAccountSchema),userService.updateUserAccount)
router.get("login",authenticate,userService.getLoggedInUserData)
router.get("getdata",authenticate,userService.getProfileData)
router.put("updatePassword",authenticate,validation(updatePasswordSchema),userService.updatePassword)
router.post("uploadProfilepic",authenticate,userService.uploadProfilePic)
router.post("uploadCoverpic",authenticate,userService.uploadCoverPic)
router.delete("deleteProfilePic",authenticate,userService.deleteProfilePic)
router.delete("deleteCoverPic",authenticate,userService.deleteCoverPic)
router.delete("Softdelete",authenticate,userService.softDeleteAccount)





export default router;
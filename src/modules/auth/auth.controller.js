import{Router} from 'express';
import * as authService from "./auth.services.js"
import { validation } from "../../middlewares/validation.js";
import {
    signUpSchema,
    confirmOTPSchema,
    signInSchema,
    signUpWithGoogleSchema,
    loginWithGoogleSchema, sendOTPForForgetPasswordSchema, resetPasswordSchema, refreshTokenSchema
} from "./auth.validation.js";

const router = Router();


router.post("/signup",validation(signUpSchema),authService.signUp)
router.post("/confirm-otp",validation(confirmOTPSchema),authService.confirmOTP)
router.post("signin",validation(signInSchema),authService.signIn)
router.post("signupwithgoogle",validation(signUpWithGoogleSchema),authService.signUpWithGoogle)
router.post("loginwithgoogle",validation(loginWithGoogleSchema),authService.loginWithGoogle)
router.post("sendOTPForForgetPassword",validation(sendOTPForForgetPasswordSchema),authService.sendOTPForForgetPassword)
router.post("resetpassword",validation(resetPasswordSchema),authService.resetPassword)
router.post("refreshtoken",validation(refreshTokenSchema),authService.refreshToken)

export default router;
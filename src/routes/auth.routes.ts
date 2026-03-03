import { Router } from "express";
import { loginAPI } from "@/apis/auth/login.api";
import { logoutAPI } from "@/apis/auth/logout.api";
import { createUserAPI } from "@/apis/auth/createUser.api";
import { updateUserAPI } from "@/apis/update/updateUser.api";
import { authenticate } from "@/middlewares/auth.middleware";
import { authorize } from "@/middlewares/rbac.middleware";
import { Role } from "@/models/user.model";

const router = Router();

router.post("/login", loginAPI);

router.post(
    "/create",
    authenticate,
    authorize([Role.REGISTRAR]),
    createUserAPI
);

router.put(
    "/users/:id",
    authenticate,
    authorize([Role.REGISTRAR]),
    updateUserAPI
);

router.post("/logout", authenticate, logoutAPI);

export default router;
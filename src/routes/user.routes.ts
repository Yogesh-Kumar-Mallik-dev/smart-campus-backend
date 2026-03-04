import { Router } from "express";
import { getUsersAPI } from "@/apis/user/getUsers.api";
import { updateUserAPI } from "@/apis/user/updateUser.api";
import { deactivateUserAPI } from "@/apis/user/deactivateUser.api";

import { authenticate } from "@/middlewares/auth.middleware";
import { authorize } from "@/middlewares/rbac.middleware";
import { Role } from "@/models/user.model";

const router = Router();

router.get(
    "/users",
    authenticate,
    authorize([Role.REGISTRAR]),
    getUsersAPI
);

router.put(
    "/users/:id",
    authenticate,
    authorize([Role.REGISTRAR]),
    updateUserAPI
);

router.patch(
    "/users/:id/deactivate",
    authenticate,
    authorize([Role.REGISTRAR]),
    deactivateUserAPI
);

export default router;
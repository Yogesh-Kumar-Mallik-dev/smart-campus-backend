import { Router } from "express";
import { getNotificationsAPI } from "@/apis/notification/getNotifications.api";
import { authenticate } from "@/middlewares/auth.middleware";

const router = Router();

router.get("/", authenticate, getNotificationsAPI);

export default router;
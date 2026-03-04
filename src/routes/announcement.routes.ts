import { Router } from "express";
import { getAnnouncementsAPI } from "@/apis/announcement/getAnnouncements.api";
import { authenticate } from "@/middlewares/auth.middleware";

const router = Router();

router.get("/", authenticate, getAnnouncementsAPI);

export default router;
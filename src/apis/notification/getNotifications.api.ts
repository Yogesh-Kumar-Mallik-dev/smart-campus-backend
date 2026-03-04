import { Request, Response } from "express";
import { Notification } from "@/models/notification.model";
import { evaluateCondition } from "@/services/notification.service";
import { Role } from "@/models/user.model";

export const getNotificationsAPI = async (req: Request, res: Response) => {
  try {
    const user = req.user!;

    const notifications = await Notification.find()
        .sort({ createdAt: -1 })
        .lean();

    const visibleNotifications = notifications.filter((n) => {
      /* ================= USER TARGET ================= */

      if (n.targetUserId && n.targetUserId.toString() !== user._id.toString()) {
        return false;
      }

      /* ================= ROLE TARGET ================= */

      if (n.targetRole && !user.roles.includes(n.targetRole as Role)) {
        return false;
      }

      /* ================= BATCH TARGET ================= */

      if (n.targetBatch && n.targetBatch !== user.batch) {
        return false;
      }

      /* ================= CLASS TARGET ================= */

      if (n.targetClass && n.targetClass !== user.class) {
        return false;
      }

      /* ================= ATTRIBUTE TARGET ================= */

      if (n.targetAttributes?.length) {
        const valid = n.targetAttributes.every((condition) =>
            evaluateCondition(user.attributes ?? {}, condition)
        );

        if (!valid) return false;
      }

      return true;
    });

    res.json(visibleNotifications);
  } catch (error) {
    console.error("Notification fetch error:", error);

    res.status(500).json({
      message: "Failed to fetch notifications",
    });
  }
};
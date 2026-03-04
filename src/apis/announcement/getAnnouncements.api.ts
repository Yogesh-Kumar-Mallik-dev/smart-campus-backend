import { Request, Response } from "express";
import { Announcement } from "@/models/announcement.model";

export const getAnnouncementsAPI = async (req: Request, res: Response) => {
  try {
    const announcements = await Announcement.find()
        .sort({ createdAt: -1 })
        .limit(20);

    res.json(announcements);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch announcements" });
  }
};
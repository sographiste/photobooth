import express, { type Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertPhotoSchema } from "@shared/schema";
import { z } from "zod";
import path from "path";
import fs from "fs";
import { nanoid } from "nanoid";
import QRCode from "qrcode";
import multer from "multer";

// Configure multer for file uploads
const uploadDir = path.join(process.cwd(), "uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage2 = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + nanoid(6);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({ storage: storage2 });

export async function registerRoutes(app: Express): Promise<Server> {
  // Get all photos
  app.get("/api/photos", async (req: Request, res: Response) => {
    try {
      const photos = await storage.getPhotos();
      res.json(photos);
    } catch (error) {
      res.status(500).json({ message: "Error retrieving photos" });
    }
  });

  // Get a single photo by ID
  app.get("/api/photos/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid photo ID" });
      }

      const photo = await storage.getPhoto(id);
      if (!photo) {
        return res.status(404).json({ message: "Photo not found" });
      }

      res.json(photo);
    } catch (error) {
      res.status(500).json({ message: "Error retrieving photo" });
    }
  });

  // Upload photo(s)
  app.post("/api/photos", upload.array("photos", 3), async (req: Request, res: Response) => {
    try {
      if (!req.files || req.files.length === 0) {
        return res.status(400).json({ message: "No photos uploaded" });
      }

      const files = req.files as Express.Multer.File[];
      const photoUrls = files.map(file => `/uploads/${file.filename}`);
      
      const baseUrl = process.env.BASE_URL || `http://${req.headers.host}`;
      const qrCodePath = path.join(uploadDir, `qr-${nanoid(6)}.png`);
      const qrCodeUrl = `/uploads/${path.basename(qrCodePath)}`;
      
      // Generate QR code with the uploaded photo URL(s)
      const qrCodeContent = `${baseUrl}/share/${nanoid(8)}`;
      await QRCode.toFile(qrCodePath, qrCodeContent);

      const type = req.body.type || "single";
      const filter = req.body.filter || "normal";
      const background = req.body.background || "none";
      const filePath = photoUrls[0]; // Main photo path for preview

      const photoData = {
        type,
        filter,
        background,
        filePath,
        photoUrls,
        qrCode: qrCodeUrl,
      };

      // Validate the data using the schema
      const validatedData = insertPhotoSchema.parse(photoData);
      
      // Create a new photo record
      const newPhoto = await storage.createPhoto(validatedData);
      
      res.status(201).json(newPhoto);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid photo data", errors: error.errors });
      }
      console.error("Error creating photo:", error);
      res.status(500).json({ message: "Error creating photo" });
    }
  });

  // Delete a photo
  app.delete("/api/photos/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid photo ID" });
      }

      const photo = await storage.getPhoto(id);
      if (!photo) {
        return res.status(404).json({ message: "Photo not found" });
      }

      // Delete the actual files from the filesystem
      const filesToDelete = [...photo.photoUrls, photo.qrCode].map(url => 
        path.join(process.cwd(), url)
      );

      for (const file of filesToDelete) {
        if (fs.existsSync(file)) {
          fs.unlinkSync(file);
        }
      }

      const success = await storage.deletePhoto(id);
      
      if (success) {
        res.status(200).json({ message: "Photo deleted successfully" });
      } else {
        res.status(500).json({ message: "Failed to delete photo" });
      }
    } catch (error) {
      console.error("Error deleting photo:", error);
      res.status(500).json({ message: "Error deleting photo" });
    }
  });

  // Serve uploaded files
  app.use("/uploads", express.static(uploadDir));

  const httpServer = createServer(app);

  return httpServer;
}

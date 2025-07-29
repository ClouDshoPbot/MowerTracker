import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertTrackingNumberSchema, insertTrackingEventSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Get tracking information by tracking number
  app.get("/api/tracking/:trackingNumber", async (req, res) => {
    try {
      const { trackingNumber } = req.params;
      const tracking = await storage.getTrackingNumber(trackingNumber);
      
      if (!tracking) {
        return res.status(404).json({ message: "Tracking number not found" });
      }

      res.json(tracking);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch tracking information" });
    }
  });

  // Get all tracking numbers for admin
  app.get("/api/admin/tracking", async (req, res) => {
    try {
      const trackings = await storage.getAllTrackingNumbers();
      res.json(trackings);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch tracking numbers" });
    }
  });

  // Get tracking statistics
  app.get("/api/admin/stats", async (req, res) => {
    try {
      const stats = await storage.getTrackingStats();
      res.json(stats);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch statistics" });
    }
  });

  // Create new tracking number
  app.post("/api/admin/tracking", async (req, res) => {
    try {
      const validatedData = insertTrackingNumberSchema.parse(req.body);
      const tracking = await storage.createTrackingNumber(validatedData);
      res.status(201).json(tracking);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create tracking number" });
    }
  });

  // Update tracking number
  app.patch("/api/admin/tracking/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const validatedData = insertTrackingNumberSchema.partial().parse(req.body);
      const tracking = await storage.updateTrackingNumber(id, validatedData);
      
      if (!tracking) {
        return res.status(404).json({ message: "Tracking number not found" });
      }

      res.json(tracking);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to update tracking number" });
    }
  });

  // Delete tracking number
  app.delete("/api/admin/tracking/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const deleted = await storage.deleteTrackingNumber(id);
      
      if (!deleted) {
        return res.status(404).json({ message: "Tracking number not found" });
      }

      res.json({ message: "Tracking number deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Failed to delete tracking number" });
    }
  });

  // Add tracking event
  app.post("/api/admin/tracking/:id/events", async (req, res) => {
    try {
      const { id } = req.params;
      const eventData = insertTrackingEventSchema.parse({
        ...req.body,
        trackingNumberId: id,
      });
      
      const event = await storage.addTrackingEvent(eventData);
      res.status(201).json(event);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to add tracking event" });
    }
  });

  // Get tracking events for a tracking number
  app.get("/api/admin/tracking/:id/events", async (req, res) => {
    try {
      const { id } = req.params;
      const events = await storage.getTrackingEvents(id);
      res.json(events);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch tracking events" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}

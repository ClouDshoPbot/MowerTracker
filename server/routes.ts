import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertTrackingNumberSchema, insertTrackingEventSchema } from "@shared/schema";
import { z } from "zod";
import archiver from "archiver";
import fs from "fs";
import path from "path";

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

  // Download project as zip
  app.get("/api/download-project", async (req, res) => {
    try {
      const archive = archiver('zip', {
        zlib: { level: 9 } // Maximum compression
      });

      // Set response headers
      res.setHeader('Content-Type', 'application/zip');
      res.setHeader('Content-Disposition', 'attachment; filename="mowerstrack-template.zip"');

      // Pipe archive to response
      archive.pipe(res);

      // Add files to archive
      const filesToInclude = [
        'package.json',
        'package-lock.json',
        'tsconfig.json',
        'vite.config.ts',
        'tailwind.config.ts',
        'postcss.config.js',
        'components.json',
        'drizzle.config.ts',
        '.gitignore',
        'replit.md'
      ];

      // Add root files
      for (const file of filesToInclude) {
        if (fs.existsSync(file)) {
          archive.file(file, { name: file });
        }
      }

      // Add entire directories
      if (fs.existsSync('client')) {
        archive.directory('client', 'client');
      }
      if (fs.existsSync('server')) {
        archive.directory('server', 'server');
      }
      if (fs.existsSync('shared')) {
        archive.directory('shared', 'shared');
      }

      // Create README for the template
      const readmeContent = `# MowersTrack - Package Tracking Template

## Overview
This is a complete package tracking system template designed for businesses that need to provide custom tracking experiences to their customers.

## Features
- ✅ Public tracking interface with professional design
- ✅ Admin panel with secure authentication
- ✅ Create, edit, and delete tracking numbers
- ✅ Add custom tracking events and status updates
- ✅ Real-time statistics dashboard
- ✅ Responsive design optimized for all devices
- ✅ Built with React, TypeScript, and Express

## Setup Instructions

### 1. Install Dependencies
\`\`\`bash
npm install
\`\`\`

### 2. Start Development Server
\`\`\`bash
npm run dev
\`\`\`

### 3. Access the Application
- **Public Tracking**: Visit \`http://localhost:5000\`
- **Admin Panel**: Visit \`http://localhost:5000/admin\`
  - Username: \`admin\`
  - Password: \`mowers2024\`

### 4. Customization
- Update branding in \`client/src/index.css\` (color variables)
- Modify company name and contact info in the header components
- Customize tracking number format in the admin panel
- Add your own logo and styling

### 5. Database (Optional)
The template uses in-memory storage by default. To use a real database:
1. Set up a PostgreSQL database
2. Add \`DATABASE_URL\` environment variable
3. Run \`npm run db:push\` to create tables

## Admin Features
- Create tracking numbers with custom details
- Add tracking events (shipped, in transit, delivered, etc.)
- Edit package information and delivery addresses
- Delete tracking numbers
- View statistics dashboard
- Search and filter packages

## Technical Stack
- **Frontend**: React 18, TypeScript, Tailwind CSS, Radix UI
- **Backend**: Express.js, TypeScript
- **Database**: Drizzle ORM (PostgreSQL/In-memory)
- **Build**: Vite for development and production

## Deployment
This template is ready for deployment on platforms like:
- Replit
- Vercel
- Railway
- Heroku
- Any Node.js hosting service

## Support
For questions or customization help, contact the original developer.

---
**MowersTrack Template** - Professional package tracking made simple.
`;

      archive.append(readmeContent, { name: 'README.md' });

      // Finalize the archive
      await archive.finalize();

    } catch (error) {
      console.error('Error creating zip:', error);
      res.status(500).json({ message: "Failed to create project download" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}

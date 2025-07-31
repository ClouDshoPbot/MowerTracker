import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileArchive, Download, Code, Truck, ArrowLeft } from "lucide-react";
import { Link } from "wouter";

export default function DownloadPage() {
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownload = async () => {
    setIsDownloading(true);
    try {
      // Open download in new tab/window
      window.open('/api/download-project', '_blank');
    } catch (error) {
      console.error('Download failed:', error);
    } finally {
      // Reset after a short delay
      setTimeout(() => setIsDownloading(false), 2000);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <Truck className="text-2xl text-brand-green" size={28} />
              <h1 className="text-2xl font-bold text-gray-900">MowersTrack</h1>
              <span className="text-sm text-gray-500 hidden sm:block">Template Download</span>
            </div>
            <Link href="/admin">
              <Button variant="outline">
                <ArrowLeft className="mr-2" size={16} />
                Back to Admin
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <FileArchive className="mx-auto text-brand-green mb-4" size={64} />
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Download MowersTrack Template</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Get the complete source code for your package tracking system. Perfect for customization and deployment.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Code className="mr-2 text-brand-green" size={20} />
                What's Included
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-gray-600">
                <li>✅ Complete React frontend with TypeScript</li>
                <li>✅ Express.js backend with API routes</li>
                <li>✅ Admin panel with authentication</li>
                <li>✅ Public tracking interface</li>
                <li>✅ Database schema and migrations</li>
                <li>✅ Tailwind CSS styling</li>
                <li>✅ Production build configuration</li>
                <li>✅ Comprehensive README with setup instructions</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Truck className="mr-2 text-brand-green" size={20} />
                Perfect For
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-gray-600">
                <li>🎯 E-commerce businesses</li>
                <li>🎯 Shipping companies</li>
                <li>🎯 Service providers</li>
                <li>🎯 Custom tracking needs</li>
                <li>🎯 Client projects</li>
                <li>🎯 Learning and development</li>
                <li>🎯 White-label solutions</li>
                <li>🎯 Rapid prototyping</li>
              </ul>
            </CardContent>
          </Card>
        </div>

        <div className="text-center">
          <Card className="inline-block">
            <CardContent className="p-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Ready to Download?</h3>
              <p className="text-gray-600 mb-6 max-w-md">
                Click below to download the complete MowersTrack template as a ZIP file. 
                Includes all source code, documentation, and setup instructions.
              </p>
              <Button
                onClick={handleDownload}
                disabled={isDownloading}
                size="lg"
                className="bg-brand-green hover:bg-brand-dark-green px-8 py-3 text-lg"
              >
                <Download className="mr-2" size={20} />
                {isDownloading ? "Preparing Download..." : "Download Template"}
              </Button>
              <p className="text-sm text-gray-500 mt-4">
                File size: ~2MB | Format: ZIP | License: Free to use
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="mt-16 border-t pt-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">Easy Setup</h4>
              <p className="text-gray-600 text-sm">
                Extract, run npm install, and you're ready to go in minutes.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">Fully Customizable</h4>
              <p className="text-gray-600 text-sm">
                Modify colors, branding, features, and functionality to match your needs.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">Production Ready</h4>
              <p className="text-gray-600 text-sm">
                Deploy to any Node.js hosting platform with built-in optimizations.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
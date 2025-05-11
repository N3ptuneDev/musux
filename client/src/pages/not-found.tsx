import { Card, CardContent } from "@/components/ui/card";
import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";

export default function NotFound() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-b from-[#282828] to-[#121212]">
      <Card className="w-full max-w-md mx-4 bg-[#181818] border-[#282828]">
        <CardContent className="pt-6">
          <div className="flex mb-4 gap-2">
            <AlertCircle className="h-8 w-8 text-[#1DB954]" />
            <h1 className="text-2xl font-bold text-white">404 Page Not Found</h1>
          </div>

          <p className="mt-4 text-sm text-[#B3B3B3] mb-6">
            Sorry, we couldn't find the page you're looking for.
          </p>
          
          <Link href="/">
            <Button className="w-full bg-[#1DB954] hover:bg-opacity-80 text-black">
              Return Home
            </Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}

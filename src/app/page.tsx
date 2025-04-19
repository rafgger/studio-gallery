"use client";

import { useState, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Grid } from "@/components/ui/grid";
import { Icons } from "@/components/icons";
import { generatePhotoTags } from "@/ai/flows/generate-photo-tags";
import { Badge } from "@/components/ui/badge";
import { NextRequest, NextResponse } from 'next/server';
// In a real app, you'd import your authentication logic here (e.g., database queries, password verification)

export async function POST(req: NextRequest) {
  try {
    const { username, password } = await req.json();

    // ** Replace this with your actual authentication logic **
    if (username === 'testuser' && password === 'password') {
      // In a real app, you would typically set a session or JWT here
      return NextResponse.json({ message: 'Login successful' });
    } else {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }
  } catch (error) {
    console.error('Error during login:', error);
    return NextResponse.json({ error: 'An error occurred' }, { status: 500 });
  }
}


const mockPhotos = [
  "https://picsum.photos/id/10/400/300",
  "https://picsum.photos/id/20/400/300",
  "https://picsum.photos/id/30/400/300",
  "https://picsum.photos/id/40/400/300",
  "https://picsum.photos/id/50/400/300",
  "https://picsum.photos/id/60/400/300",
];

export default function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [photos, setPhotos] = useState(mockPhotos);
  const [uploading, setUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [generatedTags, setGeneratedTags] = useState<string[]>([]);
  const { toast } = useToast();
  const router = useRouter();

  const handleLogin = async () => {
    // Mock authentication logic
    if (username === "testuser" && password === "password") {
      setIsLoggedIn(true);
    } else {
      toast({
        title: "Invalid credentials",
        description: "Please check your username and password.",
        variant: "destructive",
      });
    }
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setSelectedFile(event.target.files[0]);
    }
  };

  const handlePhotoUpload = useCallback(async () => {
    if (!selectedFile) {
      toast({
        title: "No file selected",
        description: "Please select a photo to upload.",
        variant: "destructive",
      });
      return;
    }

    setUploading(true);
    try {
      // Mock upload logic - replace with actual upload to Firebase Storage or similar
      const photoUrl = URL.createObjectURL(selectedFile);
      setPhotos((prevPhotos) => [...prevPhotos, photoUrl]);

      // Generate AI tags
      const tagsResult = await generatePhotoTags({ photoUrl: photoUrl });
      setGeneratedTags(tagsResult.tags);

      toast({
        title: "Photo uploaded successfully",
        description: "Your photo has been added to the gallery.",
      });
    } catch (error: any) {
      console.error("Upload error:", error);
      toast({
        title: "Upload failed",
        description: error.message || "An error occurred during upload.",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
      setSelectedFile(null); // Reset selected file
    }
  }, [selectedFile, toast]);

  useEffect(() => {
    if (generatedTags.length > 0) {
      toast({
        title: "AI Tags Generated",
        description: `Tags: ${generatedTags.join(", ")}`,
      });
    }
  }, [generatedTags, toast]);

  if (!isLoggedIn) {
    return (
      <div className="flex items-center justify-center h-screen bg-secondary">
        <Card className="w-96">
          <CardHeader className="space-y-2">
            <CardTitle className="text-center">Login</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <Button className="w-full bg-accent text-white" onClick={handleLogin}>
              Login
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-4">
      <div className="flex items-center justify-between">
        <CardTitle className="text-2xl font-bold tracking-tight">
          Welcome to PicShare!
        </CardTitle>
        <Avatar>
          <AvatarImage src="https://github.com/shadcn.png" alt="Avatar" />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Upload Photo</CardTitle>
        </CardHeader>
        <CardContent>
          <Input type="file" accept="image/*" onChange={handleFileSelect} />
          <Button
            className="w-full mt-4 bg-accent text-white"
            onClick={handlePhotoUpload}
            disabled={uploading}
          >
            {uploading ? (
              <>
                <Icons.loader className="mr-2 h-4 w-4 animate-spin" />
                Uploading...
              </>
            ) : (
              "Upload"
            )}
          </Button>
          {generatedTags.length > 0 && (
            <div className="mt-4">
              Generated Tags:
              {generatedTags.map((tag) => (
                <Badge key={tag} className="mr-2">
                  {tag}
                </Badge>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Photo Gallery</CardTitle>
        </CardHeader>
        <CardContent>
          <Grid photos={photos} />
        </CardContent>
      </Card>
    </div>
  );
}

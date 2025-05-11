import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { spotify } from "@/lib/spotify";
import { useToast } from "@/hooks/use-toast";

interface User {
  id: string;
  username: string;
}

export function useSpotifyAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [user, setUser] = useState<User | null>(null);
  const { toast } = useToast();

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['/api/spotify/me'],
    retry: 1,
    retryDelay: 500
  });
  
  // Handle success with useEffect
  useEffect(() => {
    if (data && typeof data === 'object' && 'id' in data) {
      setIsAuthenticated(true);
      setUser({
        id: data.id,
        username: data.display_name || data.id
      });
    }
  }, [data]);
  
  // Handle error
  useEffect(() => {
    if (isError) {
      console.log("Not authenticated, user needs to log in");
      setIsAuthenticated(false);
      setUser(null);
    }
  }, [isError]);

  useEffect(() => {
    if (isError && error) {
      console.error("Authentication error:", error);
    }
  }, [isError, error]);

  const login = () => {
    try {
      // Use direct window navigation instead of API call
      window.location.href = "/api/spotify/login";
    } catch (error) {
      console.error("Login error:", error);
      toast({
        title: "Login Failed",
        description: "Could not authenticate with Spotify",
        variant: "destructive"
      });
    }
  };

  const logout = async () => {
    try {
      await spotify.logout();
      setIsAuthenticated(false);
      setUser(null);
    } catch (error) {
      console.error("Logout error:", error);
      toast({
        title: "Logout Failed",
        description: "Could not logout properly",
        variant: "destructive"
      });
    }
  };

  return {
    isAuthenticated,
    isLoading,
    user,
    login,
    logout
  };
}

"use client";
import React, { useContext, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import Lookup from "@/data/Lookup";
import { Button } from "../ui/button";
import { useGoogleLogin } from "@react-oauth/google";
import axios from "axios";
import { UserDetailContext } from "@/context/UserDetailContext";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import uuid4 from "uuid4";
import { toast } from "sonner";

function SignInDialog({ openDialog, closeDialog }) {
  const { userDetail, setUserDetail } = useContext(UserDetailContext);
  const [isLoading, setIsLoading] = useState(false);
  const CreateUser = useMutation(api.users.CreateUser);

  const googleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      setIsLoading(true);
      try {
        console.log('Token response:', tokenResponse);
        
        // Get user info from Google
        const userInfo = await axios.get(
          "https://www.googleapis.com/oauth2/v3/userinfo",
          { 
            headers: { Authorization: "Bearer " + tokenResponse?.access_token },
            timeout: 10000 
          }
        );

        console.log('User info received:', userInfo.data);
        const user = userInfo.data;

        // Validate user data
        if (!user?.email || !user?.name) {
          throw new Error("Invalid user data received from Google");
        }
        
        // Try to create/get user with better error handling
        try {
          console.log('Attempting to create user in Convex...');
          const result = await CreateUser({
            name: user.name,
            email: user.email,
            picture: user.picture || '',
            uid: uuid4(),
          });
          console.log('Convex CreateUser result:', result);
        } catch (convexError) {
          console.error("Detailed Convex error:", {
            error: convexError,
            message: convexError.message,
            stack: convexError.stack,
            userData: {
              name: user.name,
              email: user.email,
              picture: user.picture
            }
          });
          
          // More specific error messages
          if (convexError.message?.includes('Server Error')) {
            toast.error("Database connection error. Please try again in a moment.");
          } else if (convexError.message?.includes('validation')) {
            toast.error("Invalid user data. Please try signing in again.");
          } else {
            toast.error(`Failed to create account: ${convexError.message}`);
          }
          return;
        }

        // Store user data in localStorage
        if (typeof window !== "undefined") {
          try {
            localStorage.setItem("user", JSON.stringify(user));
            console.log('User data stored in localStorage');
          } catch (storageError) {
            console.error('Failed to store user data:', storageError);
          }
        }

        // Update context
        setUserDetail(user);
        
        // Close dialog
        closeDialog(false);
        
        toast.success("Successfully signed in!");
        
        // Small delay before reload to ensure everything is saved
        setTimeout(() => {
          window.location.reload();
        }, 500);
        
      } catch (error) {
        console.error("Complete login error:", {
          error: error,
          message: error.message,
          response: error.response?.data,
          status: error.response?.status
        });
        
        if (error.response?.status === 401) {
          toast.error("Google authentication failed. Please try again.");
        } else if (error.message?.includes('timeout')) {
          toast.error("Request timed out. Please check your connection and try again.");
        } else if (error.message?.includes('Network Error')) {
          toast.error("Network error. Please check your connection.");
        } else {
          toast.error(`Sign in failed: ${error.message}`);
        }
      } finally {
        setIsLoading(false);
      }
    },
    onError: (errorResponse) => {
      console.error("Google login error:", errorResponse);
      toast.error("Google sign in failed. Please try again.");
      setIsLoading(false);
    },
  });

  return (
    <Dialog open={openDialog} onOpenChange={closeDialog}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle></DialogTitle>
          <DialogDescription>
            <div className="flex flex-col justify-center items-center gap-3">
              <h2 className="font-bold text-2xl text-center text-white">
                {Lookup.SIGNIN_HEADING}
              </h2>
              <p className="mt-2 text-center">{Lookup.SIGNIN_SUBHEADING}</p>
              <Button
                className="bg-blue-500 text-white hover:bg-blue-400 mt-3 disabled:opacity-50"
                onClick={() => googleLogin()}
                disabled={isLoading}
              >
                {isLoading ? "Signing in..." : "Sign In With Google"}
              </Button>
              <p className="text-sm text-gray-400">{Lookup.SIGNIn_AGREEMENT_TEXT}</p>
            </div>
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}

export default SignInDialog;
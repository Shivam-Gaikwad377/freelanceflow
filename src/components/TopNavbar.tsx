"use client";
import React, { useState } from "react";
import { useSession } from "next-auth/react";
import { useEffect } from "react";
import axios from "axios";

const TopNavbar = () => {
  const { data: session } = useSession();
  const [profileImage, setProfileImage] = useState<string>(""); 
  useEffect(() => {
    const fetchProfileImage = async () => {
      
        try {
          const response = await axios.get("/api/user/Profile");
          setProfileImage(response.data?.data.avatar?.avatarUrl);
        } catch (error) {
          console.error("Error fetching profile image:", error);
        
        }
    };
    fetchProfileImage();
      },[session])

  return (
    <header className="w-full h-16 bg-surface/80 border-b-[1.5px] border-b-outline-variant backdrop-blur-md flex justify-between items-center  sticky top-0 z-10">
      <div className="md:hidden flex items-center">
        <span className="font-headline-sm text-headline-sm font-bold text-primary dark:text-primary-fixed-dim">
          FreelanceFlow
        </span>
      </div>
      
      <div className="flex items-center gap-md ml-auto">
        <button className="text-on-surface-variant hover:bg-surface-container-low transition-colors duration-200 p-2 rounded-full cursor-pointer active:scale-95 flex items-center justify-center">
          <span className="material-symbols-outlined">notifications</span>
        </button>
        <button className="text-on-surface-variant hover:bg-surface-container-low transition-colors duration-200 p-2 rounded-full cursor-pointer active:scale-95 flex items-center justify-center hidden sm:flex">
          <span className="material-symbols-outlined">help</span>
        </button>
        <div className="h-8 w-px bg-outline-variant mx-2 hidden sm:block"></div>
        <button className="text-on-surface-variant font-medium text-label-md font-label-md hidden sm:block hover:text-primary transition-colors">
          Support
        </button>
        <div className="w-8 h-8 rounded-full bg-surface-container-high overflow-hidden border border-outline-variant cursor-pointer ml-sm">
          <img
            alt="User avatar"
            className="w-full h-full object-cover"
            src={profileImage}
          />
        </div>
      </div>
    </header>
  );
};

export default TopNavbar;

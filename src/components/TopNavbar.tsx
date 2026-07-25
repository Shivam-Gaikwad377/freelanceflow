"use client";
import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import axios from "axios";
import Image from "next/image";
import { UserRound } from "lucide-react";
import GlobalTimer from "./TimeLogs/GlobalTimer";

const TopNavbar = () => {
  const { data: session } = useSession();
  const [profileImage, setProfileImage] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfileImage = async () => {
      try {
        const response = await axios.get("/api/user/Profile");
        setProfileImage(response.data?.data?.avatar?.avatarUrl ?? null);
      } catch (error) {
        console.error("Error fetching profile image:", error);
      }
    };
    fetchProfileImage();
  }, [session]);

  return (
    <><header
      className="md:hidden bg-surface/80  backdrop-blur-md shadow-sm fixed top-0 w-full z-50 border-b border-outline-variant/30 flex justify-between items-center px-lg h-16  max-w-container-max mx-auto"
    >
      <div className="flex items-center gap-sm">
        <span
          className="text-headline-md font-headline-md font-bold text-primary "
        >FreelanceFlow</span>
      </div>
      <div className="flex items-center gap-md">
        <button
          className="p-2 rounded-full hover:bg-surface-variant transition-colors"
        >
          <span className="material-symbols-outlined text-on-surface-variant"
          >notifications</span>
        </button>
        <button
          className="p-2 rounded-full hover:bg-surface-variant transition-colors"
        >
          <span className="material-symbols-outlined text-on-surface-variant"
          >help_outline</span>
        </button>
        <div className="w-8 h-8 rounded-full bg-surface-container-high overflow-hidden border border-outline-variant cursor-pointer ml-sm flex items-center justify-center">
          {profileImage ? (
            <Image
              alt="User avatar"
              className="w-full h-full object-cover"
              src={profileImage}
              width={32}
              height={32}
            />
          ) : (
            <UserRound className="w-5 h-5 text-on-surface-variant" />
          )}
        </div>
      </div>
    </header>
      <header className=" flex w-full h-16 px-2 bg-surface/80 border-b-[1.5px] z-10 border-b-outline-variant backdrop-blur-md  justify-between items-center  sticky top-0 ">
        <div className="md:hidden pl-2 flex items-center">
          <span className="font-headline-sm text-headline-sm font-bold text-primary ">
            FreelanceFlow
          </span>
        </div>

        <div className="flex items-center gap-md ml-auto">
          <GlobalTimer />
         
         
          <div className="w-8 h-8 rounded-full bg-surface-container-high overflow-hidden border border-outline-variant cursor-pointer ml-sm flex items-center justify-center">
            {profileImage ? (
              <Image
                alt="User avatar"
                className="w-full h-full object-cover"
                src={profileImage}
                width={32}
                height={32}
              />
            ) : (
              <UserRound className="w-5 h-5 text-on-surface-variant" />
            )}
          </div>
        </div>
      </header></>
  );
};

export default TopNavbar;

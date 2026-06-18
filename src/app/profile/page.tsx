"use client";
import React, { useEffect, useState, useRef } from "react";
import Sidebar from "@/components/Sidebar";
import TopNavbar from "@/components/TopNavbar";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { toast } from "sonner";
import formData from "form-data";

const page = () => {
  const session = useSession();
  const router = useRouter();
  const [profile, setProfile] = useState<any>(null);
  const currencys = [
    { code: "USD", symbol: "$" },
    { code: "EUR", symbol: "€" },
    { code: "GBP", symbol: "£" },
    { code: "JPY", symbol: "¥" },
    { code: "CAD", symbol: "C$" },
    { code: "INR", symbol: "₹" },
    { code: "AUD", symbol: "A$" },
    { code: "CHF", symbol: "CHF" },
  ];

  const [imageFile, setImageFile] = useState<File | null>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const handleEditPictureClick = () => {
    if (imageInputRef.current) {
      imageInputRef.current.click();
    }
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    // 1. Grab the file directly from the event target
    const targetFile = e.target.files?.[0];
    if (!targetFile) return;

    // Update local state for tracking if needed
    setImageFile(targetFile);
    try {
      const uploadData = new FormData();
      uploadData.append("avatar", targetFile as File);

      const res = await axios.patch("/api/user/avatar", uploadData);
      const updatedProfile = await axios.get("/api/user/Profile");
      setProfile(updatedProfile.data.data);
      toast.success("Avatar updated successfully!");
      // Refresh profile data to show new avatar
    } catch (error) {
      toast.error("Error updating avatar.");
    } finally {
      console.log("Updated profile data:", profile.avatar.avatarUrl);
    }
  };

  const [editing, setEditing] = useState(false);
  useEffect(() => {
    if (!session) {
      // Redirect to login page if not authenticated
      router.replace("/login");
    }
    try {
      const fetchProfile = async () => {
        const response = await axios.get("/api/user/Profile");
        console.log("Profile data:", response.data);
        setProfile(response.data.data);
      };
      fetchProfile();
    } catch (error: any) {
      toast.error(("Error fetching profile" + error.message) as string);
    }
  }, []);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const handleChangePassword = async (
    currentPassword: string,
    newPassword: string
  ) => {
    try {
      const response = await axios.put("/api/user/change-password", {
        currentPassword,
        newPassword,
      });
      toast.success("Password changed successfully!");
    } catch (error: any) {
      toast.error("Error changing password: " + error.response?.data?.message);
    }
  };
  return (
    <div>
      <Sidebar />
      <div className="md:ml-64">
        <TopNavbar source={profile?.avatar?.avatarUrl} />
        <main className="flex-1 overflow-y-auto p-margin-mobile md:p-gutter lg:p-xl">
          <div className="max-w-3xl mx-auto space-y-lg">
            <div className="mb-lg">
              <h1 className="font-headline-lg-mobile md:font-headline-lg text-headline-lg-mobile md:text-headline-lg text-on-surface">
                Settings
              </h1>
              <p className="font-body-md text-body-md text-on-surface-variant mt-xs">
                Manage your personal and business profile details.
              </p>
            </div>
            <div className="bg-surface-container-lowest rounded-lg border border-outline-variant p-lg shadow-level-1">
              {/* <!-- Profile Header --> */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-lg border-b border-outline-variant pb-lg mb-lg">
                <div className="relative group">
                  <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-surface bg-surface-container-high relative">
                    <img
                      alt="User avatar"
                      className="w-full h-full object-cover"
                      src={profile?.avatar.avatarUrl || "/images/avatar.png"}
                    />
                  </div>
                </div>
                <div className="flex-1">
                  <h2 className="font-headline-md text-headline-md text-on-surface">
                    {profile?.name || "Name not set"}
                  </h2>
                  <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">
                    {profile?.email || "Email not set"}
                  </p>
                  <div className="mt-md">
                    <button
                      onClick={handleEditPictureClick}
                      className="px-md py-sm bg-surface-container-high text-on-surface font-label-md text-label-md rounded border border-outline-variant hover:bg-surface-variant transition-colors flex items-center gap-xs"
                    >
                      <span className="material-symbols-outlined text-[18px]">
                        photo_camera
                      </span>
                      Edit Picture
                    </button>
                    <input
                      className="px-md py-sm hidden bg-surface-container-high text-on-surface font-label-md text-label-md rounded border border-outline-variant hover:bg-surface-variant transition-colors  items-center gap-xs"
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      ref={imageInputRef}
                    />
                  </div>
                </div>
              </div>
              {/* Forms */}
              <div className="space-y-xl">
                {/* Personal Details */}
                <section>
                  <h3 className="font-headline-sm text-headline-sm text-on-surface mb-md">
                    Personal Details
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-md">
                    <div>
                      <p className="block font-label-md text-label-md text-on-surface mb-xs">
                        Full Name
                      </p>

                      {editing ? (
                        <input
                          className="w-full px-4 py-2 rounded-lg bg-surface-container-lowest input-border border font-body-md text-body-md text-on-surface"
                          type="text"
                          value={profile?.name || ""}
                        />
                      ) : (
                        <p className="font-body-md text-body-md text-on-surface">
                          {profile?.name || "No name set"}
                        </p>
                      )}
                    </div>
                    <div>
                      <p className="block font-label-md text-label-md text-on-surface mb-xs">
                        Email Address
                      </p>
                      {editing ? (
                        <input
                          className="w-full px-4 py-2 rounded-lg bg-surface-container-lowest input-border border font-body-md text-body-md text-on-surface"
                          type="email"
                          value={profile?.email || ""}
                        />
                      ) : (
                        <p className="font-body-md text-body-md text-on-surface">
                          {profile?.email || "No email address set"}
                        </p>
                      )}
                    </div>
                  </div>
                </section>
                {/* Business Settings */}
                <section>
                  <h3 className="font-headline-sm text-headline-sm text-on-surface mb-md">
                    Business Settings
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-md">
                    <div>
                      <p className="block font-label-md text-label-md text-on-surface mb-xs">
                        Business Name
                      </p>
                      {editing ? (
                        <input
                          className="w-full px-4 py-2 rounded-lg bg-surface-container-lowest input-border border font-body-md text-body-md text-on-surface"
                          type="text"
                          value={profile?.businessName || ""}
                        />
                      ) : (
                        <p className="font-body-md text-body-md text-on-surface">
                          {profile?.businessName || "No business name set"}
                        </p>
                      )}
                    </div>
                    <div>
                      <p className="block font-label-md text-label-md text-on-surface mb-xs">
                        Currency
                      </p>
                      <div className="relative">
                        {editing ? (
                          <select className="w-full px-4 py-2 rounded-lg bg-surface-container-lowest input-border border font-body-md text-body-md text-on-surface appearance-none pr-10">
                            {currencys.map((currency) => (
                              <option
                                key={currency.code}
                                value={currency.code}
                                selected={profile?.currency === currency.code}
                              >
                                {currency.code} - {currency.symbol}
                              </option>
                            ))}
                            <option value="other">Other</option>
                            <span className="material-symbols-outlined text-on-surface absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                              expand_more
                            </span>
                          </select>
                        ) : (
                          <p className="font-body-md text-body-md text-on-surface">
                            {profile?.currency || "No currency set"}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  <div
                    className={
                      "border-b p-md border-outline-variant flex justify-end gap-sm"
                    }
                  >
                    {editing && (
                      <button
                        className="px-lg py-3 bg-transparent text-primary font-label-md text-label-md rounded hover:bg-surface-container-low transition-colors"
                        type="button"
                        onClick={() => setEditing(false)}
                      >
                        Cancel
                      </button>
                    )}
                    {editing ? (
                      <button
                        className="px-lg py-3 bg-primary text-on-primary font-label-md text-label-md rounded shadow-level-2 hover:bg-surface-tint transition-colors"
                        type="button"
                      >
                        Save Changes
                      </button>
                    ) : (
                      <button
                        className="px-lg py-3 bg-primary text-on-primary font-label-md text-label-md rounded shadow-level-2 hover:bg-surface-tint transition-colors"
                        type="button"
                        onClick={() => setEditing(true)}
                      >
                        Edit Profile
                      </button>
                    )}
                  </div>
                </section>
                <section className="mt-xl">
                  <h3 className="font-headline-sm text-headline-sm text-on-surface mb-md text-primary">
                    Security
                  </h3>
                  <div className="space-y-md">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-md">
                      <div>
                        <label className="block font-label-md text-label-md text-on-surface mb-xs">
                          Current Password
                        </label>
                        <input
                          className="w-full px-4 py-2 rounded-lg bg-surface-container-lowest input-border border font-body-md text-body-md text-on-surface focus:ring-primary/20 focus:border-primary py-3"
                          type="password"
                          placeholder="••••••••"
                          value={currentPassword}
                          onChange={(e) => setCurrentPassword(e.target.value)}
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-md">
                      <div>
                        <label className="block font-label-md text-label-md text-on-surface mb-xs">
                          New Password
                        </label>
                        <input
                          className="w-full px-4 py-2 rounded-lg bg-surface-container-lowest input-border border font-body-md text-body-md text-on-surface focus:ring-primary/20 focus:border-primary py-3"
                          type="password"
                          placeholder="••••••••"
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                        />
                      </div>
                      <div>
                        <label className="block font-label-md text-label-md text-on-surface mb-xs">
                          Confirm New Password
                        </label>
                        <input
                          className="w-full px-4 py-2 rounded-lg bg-surface-container-lowest input-border border font-body-md text-body-md text-on-surface focus:ring-primary/20 focus:border-primary py-3"
                          type="password"
                          placeholder="••••••••"
                          value={confirmNewPassword}
                          onChange={(e) =>
                            setConfirmNewPassword(e.target.value)
                          }
                        />
                      </div>
                      {confirmNewPassword &&
                        newPassword !== confirmNewPassword && (
                          <p className="text-red-500 text-sm mt-1">
                            New password and confirmation do not match.
                          </p>
                        )}
                    </div>
                    <div className="flex justify-start">
                      <button
                        className="px-md py-sm cursor-pointer active:scale-98 bg-surface-container-high text-on-surface font-label-md text-label-md rounded border border-outline-variant hover:bg-surface-variant transition-colors"
                        type="button"
                        onClick={() =>
                          handleChangePassword(currentPassword, newPassword)
                        }
                      >
                        Update Password
                      </button>
                    </div>
                  </div>
                </section>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default page;

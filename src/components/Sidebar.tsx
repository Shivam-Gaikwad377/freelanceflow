"use client";
import React from "react";
import Link from "next/link";

import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import PrimaryButton from "./PrimaryButton";


import {useUiStore} from "@/store/useUiStore";
const Sidebar = () => {
  const activeItem : any = usePathname().split("/")[1] ;
  const router = useRouter();  
  const openModal = useUiStore((state) => state.openModal);
  const closeModal = useUiStore((state) => state.closeModal);
  
  return (
    <>
      
      <nav className="hidden md:flex flex-col p-md w-64 h-screen bg-surface-container-lowest border-r border-outline-variant fixed left-0 top-0 z-20">
        <div className="flex items-center space-x-3 mb-xl px-sm pt-sm">
          <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center text-on-primary font-headline-md">
            F
          </div>
          <div>
            <h1 className="text-headline-sm font-headline-sm font-bold text-primary">
              FreelanceFlow
            </h1>
            <p className="text-label-sm font-label-sm text-on-surface-variant">
              Pro Workspace
            </p>
          </div>
        </div>
        <PrimaryButton
          label=" New Project"
          onClick={() => openModal("addProject")}
          icon="add"
          
        />
        <div className="flex-1 mt-8 space-y-sm">
          <Link
            onClick={() => {closeModal()}}
            href="/dashboard"
            className={
              activeItem === "dashboard"
                ? "flex items-center space-x-3 px-4 py-3 bg-primary text-on-primary-container rounded-lg font-label-md transition-transform duration-100 scale-95 opacity-90"
                : "flex items-center space-x-3 px-4 py-3 text-on-surface-variant hover:bg-surface-container-low rounded-lg font-label-md transition-transform duration-200 hover:scale-[1.02]"
            }
            
          >
            <span className="material-symbols-outlined" data-icon="dashboard">
              dashboard
            </span>
            <span>Dashboard</span>
          </Link>
          <Link
            href="/projects"
            onClick={() => {closeModal()}}
            className={
              activeItem === "projects"
                ? "flex items-center space-x-3 px-4 py-3 bg-primary text-on-primary-container rounded-lg font-label-md transition-transform duration-100 scale-95 opacity-90"
                : "flex items-center space-x-3 px-4 py-3 text-on-surface-variant hover:bg-surface-container-low rounded-lg font-label-md transition-transform duration-200 hover:scale-[1.02]"
            }
          >
            <span className="material-symbols-outlined" data-icon="work">
              work
            </span>
            <span>Projects</span>
          </Link>
          <Link
            href="/invoices"
            onClick={() => {closeModal()}}
            className={
              activeItem === "invoices"
                ? "flex items-center space-x-3 px-4 py-3 bg-primary text-on-primary-container rounded-lg font-label-md transition-transform duration-100 scale-95 opacity-90"
                : "flex items-center space-x-3 px-4 py-3 text-on-surface-variant hover:bg-surface-container-low rounded-lg font-label-md transition-transform duration-200 hover:scale-[1.02]"
            }
          >
            <span
              className="material-symbols-outlined"
              data-icon="receipt_long"
            >
              receipt_long
            </span>
            <span>Invoices</span>
          </Link>
          <Link
            href="/clients"
            onClick={()=>{closeModal()}}
            className={
              activeItem === "clients"
                ? "flex items-center space-x-3 px-4 py-3 bg-primary text-on-primary-container rounded-lg font-label-md transition-transform duration-100 scale-95 opacity-90"
                : "flex items-center space-x-3 px-4 py-3 text-on-surface-variant hover:bg-surface-container-low rounded-lg font-label-md transition-transform duration-200 hover:scale-[1.02]"
            }
          >
            <span className="material-symbols-outlined" data-icon="group">
              group
            </span>
            <span>Clients</span>
          </Link>
          <Link
            href="/profile"
            onClick={()=>closeModal()}
            className={
              activeItem === "profile"
                ? "flex items-center space-x-3 px-4 py-3 bg-primary text-on-primary-container rounded-lg font-label-md transition-transform duration-100 scale-95 opacity-90"
                : "flex items-center space-x-3 px-4 py-3 text-on-surface-variant hover:bg-surface-container-low rounded-lg font-label-md transition-transform duration-200 hover:scale-[1.02]"
            }
          >
            <span className="material-symbols-outlined" data-icon="settings">
              settings
            </span>
            <span>Profile</span>
          </Link>
        </div>
        <div className="pt-4 border-t border-outline-variant space-y-sm">
          <Link
            href="/support"
            className="flex items-center space-x-3 px-4 py-3 text-on-surface-variant hover:bg-surface-container-low rounded-lg font-label-md transition-transform duration-200 hover:scale-[1.02]"
          >
            <span
              className="material-symbols-outlined"
              data-icon="contact_support"
            >
              contact_support
            </span>
            <span>Support</span>
          </Link>
          <Link
            className="flex items-center space-x-3 px-4 py-3 text-error hover:bg-error-container rounded-lg font-label-md transition-transform duration-200 hover:scale-[1.02]"
            href="/logout"
            onClick={(e) => {
              e.preventDefault();
              signOut();
              router.replace("/login");
            }}
          >
            <span className="material-symbols-outlined" data-icon="logout">
              logout
            </span>
            <span>Logout</span>
          </Link>
        </div>
      </nav>
    </>
  );
};

export default Sidebar;

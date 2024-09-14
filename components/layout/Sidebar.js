"use client";

import React from "react";
import "./layout.css";
import Logo from "@/public/images/logo.png";
import Image from "next/image";
import Search from "@/public/icons/search-icon.svg";
import Settings from "@/public/icons/settings-icon.svg";
import { usePathname, useRouter } from "next/navigation";
import SelectForm from "../common/SelectForm";

const Sidebar = () => {
  const router = useRouter();
  const pathname = usePathname();

  const handleOpenChat = () => {
    if (pathname === "/chats") {
      router.replace(`/news`, undefined, { shallow: true });
    } else {
      router.replace(`/chats`, undefined, { shallow: true });
    }
  };

  const handleOpenSetting = () => {
    router.replace(`/settings`, undefined, { shallow: true });
  };

  const handleOpenNews = () => {
    router.replace(`/news`, undefined, { shallow: true });
  };

  return (
    <div className="h-100 bg-[#F9F9F9] rounded-[20px] sidebar-wrapper">
      <div className="sidebar-header">
        <div className="wrapper">
          <div className="logo-container" onClick={handleOpenNews}>
            <Image src={Logo} alt="logo" className="image" style={{objectFit: 'contain'}}/>
          </div>
          <div className="search-container" onClick={handleOpenChat}>
            <Image src={Search} alt="search" className="image" style={{objectFit: 'contain'}}/>
          </div>
        </div>
        <input
          type="text"
          placeholder="Search for anything..."
          className="search-input rounded-[8px] h-[52px]"
        />
      </div>
      <div className="sidebar-content">
        <SelectForm />
        <SelectForm />
        <SelectForm />
        <SelectForm />
        <SelectForm />
        <SelectForm />
      </div>
      <div className="sidebar-footer">
        <div className="avatar"></div>
        <div className="flex flex-col info">
          <span className="title">Daniel Simon</span>
          <span className="setting" onClick={handleOpenSetting}>
            <div className="settings-container">
              <Image src={Settings} alt="settings" className="image" />
            </div>
            Profile Setting
          </span>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;

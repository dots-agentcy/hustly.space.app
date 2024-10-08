"use client";

import Sidebar from "@/components/layout/Sidebar";
import "./styles.css";
import { redirect, usePathname, useRouter } from "next/navigation";
import ModalLayer from "@/components/layout/ModalLayer";
import React, { useEffect, useState } from "react";
import { getProfile, getSuggestions } from "@/api/profile";
import { getCompetion, getDomain, getUniversity } from "@/api/option";
import { BeatLoader } from "react-spinners";
import { useDispatch } from "react-redux";
import { setUserInfo } from "@/reducers/userInfoSlice";
import { setCompetition } from "@/reducers/competitionSlice";
import { setUniversity } from "@/reducers/universitySlice";
import { setDomain } from "@/reducers/domainSlice";
import { setSuggestion } from "@/reducers/suggestionSlice";
import { getAuthToken } from "@/libs/clients";

export default function Layout({ children }) {
  const pathname = usePathname();
  const dispatch = useDispatch();
  const [openModalSetting, setOpenModalSetting] = useState(false);
  const [isFirstRender, setIsFirstRender] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [isFirstRenderFilter, setIsFirstRenderFilter] = useState(true);
  const [isSidebarLoading, setIsSidebarLoading] = useState(true);
  const [filter, setFilter] = useState({
    university__id: "",
    team_member_count: "",
    city: "",
    competition__id: "",
    domain__id: "",
    skill_set: "",
    age__gte: 18,
    age__lte: 25,
    competition__year: "",
  });
  const [isFirstSetting, setIsFirstSetting] = useState(false);

  const isHaveSidebar = pathname === "/news";

  const toggleOpenModalSetting = () => {
    setOpenModalSetting(!openModalSetting);
  };

  const fetchSuggestion = (data) => {
    setIsLoading(true);
    getSuggestions(data)
      .then((res) => {
        dispatch(setSuggestion(res));
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  useEffect(() => {
    const accessToken = getAuthToken()

    if (!accessToken && isHaveSidebar) {
      redirect("/auth-login");
    }
  }, []);

  useEffect(() => {
    if (!isFirstRender) {
      const data = {
        university__id: filter.university__id,
        team_member_count: filter.team_member_count,
        city: filter.city,
        competition__id: filter.competition__id,
        domain__id: filter.domain__id,
        skill_set: filter.skill_set,
        age__gte: filter.age__gte,
        age__lte: filter.age__lte,
        competition__year: filter.competition__year,
        gender: filter.gender,
      };

      for (const key in data) {
        if (data[key] === "" || data[key] === null) {
          delete data[key];
        }
      }

      fetchSuggestion(data);
    }
  }, [filter]);

  const search = (value) => {
    const data = {
      search: value,
    };

    fetchSuggestion(data);
  };

  const fetchProfile = () => {
    setIsSidebarLoading(true);
    getProfile()
      .then((res) => {
        if (!res.is_update_setting) {
          setIsFirstSetting(true);
          setOpenModalSetting(true);
        }
        dispatch(setUserInfo(res));
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const fetchCompetion = () => {
    getCompetion()
      .then((res) => {
        dispatch(setCompetition(res));
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const fetchUniversity = () => {
    getUniversity()
      .then((res) => {
        dispatch(setUniversity(res));
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const fetchDomain = () => {
    getDomain()
      .then((res) => {
        dispatch(setDomain(res));
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    const fetchData = async () => {
      if (isHaveSidebar && isFirstRenderFilter) {
        await Promise.all([
          fetchCompetion(),
          fetchUniversity(),
          fetchDomain(),
        ]);
        if(isFirstRender){
          fetchProfile();
          setIsFirstRender(false);
          setIsSidebarLoading(false);
        }
        setIsFirstRenderFilter(false);
      }
    };

    fetchData()
  }, [isHaveSidebar]);

  return (
    <>
      <div className="wrapper">
        {isHaveSidebar && (
          <Sidebar
            toggleOpenModalSetting={toggleOpenModalSetting}
            isSidebarLoading={isSidebarLoading}
            search={search}
            filter={filter}
            setFilter={setFilter}
          />
        )}
        {isLoading && pathname === "/news" ? (
          <div className="w-screen h-[100vh] bg-black flex items-center justify-center">
            <BeatLoader color="#fff" size={10} />
          </div>
        ) : (
          children
        )}
        {openModalSetting && (
          <ModalLayer
            toggleOpenModalSetting={toggleOpenModalSetting}
            isFirstSetting={isFirstSetting}
          />
        )}
      </div>
    </>
  );
}

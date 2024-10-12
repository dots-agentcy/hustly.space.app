"use client";

import React, { useEffect, useState } from "react";
import "./styles.css";
import Badge from "@/components/common/Badge";
import ModalDetail from "@/components/layout/ModalDetail";
import UserIcon from "@/public/icons/user2-icon.svg";
import BirthdayIcon from "@/public/icons/birthday-icon.svg";
import LocationIcon from "@/public/icons/location-icon.svg";
import Image from "next/image";
import { useSelector } from "react-redux";
import { checkThread, createThread } from "@/api/thread";
import { removeVietnameseTones } from "@/utils/utils";

const News = () => {
  const userInfo = useSelector((state) => state.userInfo);
  const university = useSelector((state) => state.university);
  const domain = useSelector((state) => state.domain);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [suggestionData, setSuggestionData] = useState([]);
  const suggestion = useSelector((state) => state.suggestion);
  const [check, setCheck] = useState(null);

  useEffect(() => {
    setSuggestionData(suggestion.data);
  }, [suggestion]);

  const handleDetailCard = (index) => {
    if (isModalOpen === index) {
      setIsModalOpen(false);
    } else {
      const data = {
        to_user_id: index,
        is_check: true,
      };
      createThread(userInfo.id, data)
        .then((res) => {
          setCheck(res.thread_id);
        })
        .catch((err) => {
          console.log(err);
        });
      setIsModalOpen(index);
    }
  };

  const universityOptions = university?.map((item) => {
    return {
      value: String(item.id),
      label: removeVietnameseTones(item.name),
    };
  });

  const searchParams = new URLSearchParams(window.location.search);
  const rel = searchParams.get("rel");

  useEffect(() => {
    if (!!rel) {
      setIsModalOpen(rel);
      window.history.replaceState(null, null, window.location.pathname);
    }
  }, [rel]);

  return (
    <>
      <div className="news-wrapper">
        <div className="flex flex-col">
          <span className="greeting">
            Hello {userInfo?.first_name}! tim dong chi?
          </span>
          <span className="description">Have you found a partner yet?</span>
        </div>
        <div className="card-wrapper grid grid-cols-1 md:grid-cols-2 pb-12 mb-12">
          {suggestionData?.map((item) => {
            const uni = universityOptions.find((e) => e.id === item?.city);

            return (
              <div
                className="card-item"
                key={item.id}
                onClick={() => handleDetailCard(item.id)}
              >
                <div className="card-header flex">
                  <div className="avatar">
                    {item?.avatar?.file && (
                      <Image
                        src={item?.avatar?.file}
                        alt="avatar"
                        width={64}
                        height={64}
                        style={{
                          objectFit: "cover",
                          height: "100%",
                          width: "100%",
                          borderRadius: "50%",
                        }}
                      />
                    )}
                  </div>
                  <div className="flex flex-col info justify-center">
                    <span className="name flex items-center gap-[4px]">
                      <span
                        className="lh-1 h-[12px]text-center"
                        style={{
                          fontSize:
                            "clamp(14px, calc((22 / 1920) * 100vw), 26px)",
                        }}
                      >
                        {item.first_name} {item.last_name}
                      </span>

                      <div
                        className={`w-[10px] h-[10px] rounded-full`}
                        style={{ backgroundColor: item.color || "#ffffff" }}
                      ></div>
                    </span>
                    <div className="flex gap-[24px] items-center">
                      <div className="location flex items-start gap-[4px]">
                        <Image
                          src={LocationIcon}
                          alt="location-icon"
                          width={12}
                          height={12}
                        />
                        <span>{uni || "Hanoi"}</span>
                      </div>
                      <div className="location flex items-start gap-[4px]">
                        <Image
                          src={BirthdayIcon}
                          alt="birth-icon"
                          width={12}
                          height={12}
                        />
                        <span>{item.age || "18"}</span>
                      </div>
                      <div className="location h-[16px] flex items-start gap-[4px]">
                        <Image
                          src={UserIcon}
                          alt="mem-icon"
                          width={12}
                          height={12}
                        />
                        <span>{item.team_member_count}</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="card-body">
                  <span className="description">
                    {item.bio?.length > 100
                      ? item.bio?.slice(0, 100) + "..."
                      : item.bio}
                  </span>
                  <div className="tags">
                    {[
                      ...new Set(
                        item.domain?.map((domainItem) =>
                          domainItem.parent_domain !== null
                            ? domainItem.parent_domain
                            : domainItem.id
                        )
                      ),
                    ].map((uniqueId) => {
                      const sd = domain?.find((e) => e.id === uniqueId)?.name;
                      const colorItem = item.domain?.find(
                        (e) => e.id === uniqueId || e.parent_domain === uniqueId
                      );
                      return (
                        <Badge
                          key={uniqueId}
                          backgroundColor={`#434343`}
                          color={colorItem?.color}
                          name={sd}
                        />
                      );
                    })}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      {isModalOpen !== false && (
        <ModalDetail isOpen={isModalOpen} check={check} />
      )}
    </>
  );
};

export default News;

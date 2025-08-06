import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAnnouncements } from "../redux/slices/announcementSlice";
import { motion } from "framer-motion";

const AnnouncementsList = () => {
  const dispatch = useDispatch();
  const { items, status, error } = useSelector((state) => state.announcement);

  useEffect(() => {
    dispatch(fetchAnnouncements());
  }, [dispatch]);

  if (status === "loading") return <p>Loading announcements...</p>;
  if (status === "failed") return <p>Error: {error}</p>;
  if (items.length === 0) return null;
  return (
    <motion.ul
      initial="hidden"
      animate="visible"
      variants={{
        hidden: { opacity: 0, y: 50 },
        visible: {
          opacity: 1,
          y: 0,
          transition: { staggerChildren: 0.11, delayChildren: 0.2 },
        },
      }}
      className="space-y-5"
    >
        <h2 className="text-2xl font-bold mb-4 text-yellow-400">Announcements</h2>
      {items.map(({ _id, title, message, createdBy }) => (
        <motion.li
          key={_id}
          variants={{
            hidden: { opacity: 0, y: 20 },
            visible: { opacity: 1, y: 0 },
          }}
          transition={{ duration: 0.6, type: "spring" }}
          className="border rounded-lg bg-gray-800 text-white p-4 shadow-lg"
        >
          <h3 className="font-bold text-lg text-yellow-400">{title}</h3>
          <p className="mt-1 text-gray-200">{message}</p>
          <div className="mt-2 text-sm text-yellow-200">
            By: {createdBy?.name || "Admin"}
          </div>
        </motion.li>
      ))}
    </motion.ul>
  );
};

export default AnnouncementsList;

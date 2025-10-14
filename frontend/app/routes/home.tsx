import type { Route } from "./+types/home";
import React from "react";

// import ChatRoom from "../component/others/chatroom.jsx";
import Landing from "../component/landing_page";
export function meta({}: Route.MetaArgs) {
  return [
    { title: "New React Router App" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}

const roomId = "room1";
const username = "Alice";
export default function Home() {
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  return (
    <>
      {/* <ChatRoom roomId={roomId} username={username} /> */}
      <div className="min-h-screen flex items-center justify-center">
        <Landing />
      </div>
    </>
  );
}

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { Box, Avatar, Typography, Button, IconButton } from "@mui/material";
import red from "@mui/material/colors/red";
import { useAuth } from "../context/AuthContext";
import ChatItem from "../components/chat/ChatItem";
import { IoMdSend } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import {
  deleteUserChats,
  getUserChats,
  sendChatRequest,
} from "../helpers/api-communicator";

type Message = {
  role: "user" | "assistant";
  content: string;
};

const Chat = () => {
  const navigate = useNavigate();
  const inputRef = useRef<HTMLInputElement | null>(null);
  const chatContainerRef = useRef<HTMLDivElement | null>(null);
  const auth = useAuth();
  const [chatMessages, setChatMessages] = useState<Message[]>([]);

  // Scroll to the latest message
  const scrollToBottom = () => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  };

  // Handle sending a new message
  const handleSubmit = async () => {
    const content = inputRef.current?.value?.trim();
    if (!content) return;

    // Clear input
    if (inputRef.current) inputRef.current.value = "";

    const newMessage: Message = { role: "user", content };
    setChatMessages((prev) => [...prev, newMessage]);

    try {
      const chatData = await sendChatRequest(content);
      setChatMessages((prev) => [...prev, ...chatData.chats]);
    } catch (error) {
      console.error("Error sending message:", error);
      toast.error("Failed to send message. Please try again.");
    } finally {
      scrollToBottom();
    }
  };

  // Handle deleting all chats
  const handleDeleteChats = async () => {
    try {
      toast.loading("Deleting Chats", { id: "deletechats" });
      await deleteUserChats();
      setChatMessages([]);
      toast.success("Deleted Chats Successfully", { id: "deletechats" });
    } catch (error) {
      console.error("Error deleting chats:", error);
      toast.error("Failed to delete chats.", { id: "deletechats" });
    }
  };

  // Fetch user chats on component mount
  useLayoutEffect(() => {
    const fetchChats = async () => {
      if (auth?.isLoggedIn && auth.user) {
        toast.loading("Loading Chats", { id: "loadchats" });
        try {
          const data = await getUserChats();
          setChatMessages([...data.chats]);
          toast.success("Successfully loaded chats", { id: "loadchats" });
        } catch (err) {
          console.error("Error fetching chats:", err);
          toast.error("Failed to load chats.", { id: "loadchats" });
        }
      }
    };

    fetchChats();
  }, [auth]);

  // Redirect to login if user is not authenticated
  useEffect(() => {
    if (!auth?.user) {
      navigate("/login");
    }
  }, [auth, navigate]);

  return (
    <Box
      sx={{
        display: "flex",
        flex: 1,
        width: "100%",
        height: "100%",
        mt: 3,
        gap: 3,
      }}
    >
      <Box
        sx={{
          display: { md: "flex", xs: "none", sm: "none" },
          flex: 0.2,
          flexDirection: "column",
        }}
      >
        <Box
          sx={{
            display: "flex",
            width: "100%",
            height: "60vh",
            bgcolor: "rgb(17,29,39)",
            borderRadius: 5,
            flexDirection: "column",
            mx: 3,
          }}
        >
          <Avatar
            sx={{
              mx: "auto",
              my: 2,
              bgcolor: "white",
              color: "black",
              fontWeight: 700,
            }}
          >
            {auth?.user?.name[0]}
            {auth?.user?.name.split(" ")[1]?.[0]}
          </Avatar>
          <Typography sx={{ mx: "auto", fontFamily: "work sans" }}>
            You are talking to a ChatBOT
          </Typography>
          <Typography sx={{ mx: "auto", fontFamily: "work sans", my: 4, p: 3 }}>
            You can ask questions about Knowledge, Business, Advice, Education,
            etc. Avoid sharing personal information.
          </Typography>
          <Button
            onClick={handleDeleteChats}
            sx={{
              width: "200px",
              my: "auto",
              color: "white",
              fontWeight: "700",
              borderRadius: 3,
              mx: "auto",
              bgcolor: red[300],
              ":hover": {
                bgcolor: red.A400,
              },
            }}
          >
            Clear Conversation
          </Button>
        </Box>
      </Box>
      <Box
        sx={{
          display: "flex",
          flex: { md: 0.8, xs: 1, sm: 1 },
          flexDirection: "column",
          px: 3,
        }}
      >
        <Typography
          sx={{
            fontSize: "40px",
            color: "white",
            mb: 2,
            mx: "auto",
            fontWeight: "600",
          }}
        >
          Model - GPT 3.5 Turbo
        </Typography>
        <Box
          ref={chatContainerRef}
          sx={{
            width: "100%",
            height: "60vh",
            borderRadius: 3,
            mx: "auto",
            display: "flex",
            flexDirection: "column",
            overflow: "auto",
            scrollBehavior: "smooth",
          }}
        >
          {chatMessages.map((chat, index) => (
            <ChatItem content={chat.content} role={chat.role} key={index} />
          ))}
        </Box>
        <div
          style={{
            width: "100%",
            borderRadius: 8,
            backgroundColor: "rgb(17,27,39)",
            display: "flex",
            margin: "auto",
          }}
        >
          <input
            ref={inputRef}
            type="text"
            placeholder="Type a message..."
            style={{
              width: "100%",
              backgroundColor: "transparent",
              padding: "15px",
              border: "none",
              outline: "none",
              color: "white",
              fontSize: "18px",
            }}
          />
          <IconButton onClick={handleSubmit} sx={{ color: "white", mx: 1 }}>
            <IoMdSend />
          </IconButton>
        </div>
      </Box>
    </Box>
  );
};

export default Chat;

"use client";
import {
  Button,
  Flex,
  Group,
  ScrollArea,
  Stack,
  Text,
  TextInput,
  Title,
} from "@mantine/core";
import { useRouter, useSearchParams } from "next/navigation";
import React, {
  useCallback,
  useEffect,
  useRef,
  useState,
  Suspense,
} from "react";
import io from "socket.io-client";
const socket = io("http://localhost:3001");

function FinderComponent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const game = searchParams.get("game");
  const viewport = useRef<HTMLDivElement>(null);
  const [messages, setMessages] = useState<
    { text: string; isSender: boolean }[]
  >([]);
  const [room, setRoom] = useState(game);

  const joinRoom = useCallback(() => {
    if (room) {
      socket.emit("join_room", room);
    }
  }, [room]);

  useEffect(() => {
    joinRoom();
  }, [joinRoom]);

  const sendMessage = useCallback(
    (newMessage: string) => {
      socket.emit("send_message", { message: newMessage, room });
    },
    [room]
  );

  useEffect(() => {
    const handleReceiveMessage = (data: { message: string; room: string }) => {
      if (data.room === room) {
        setMessages((prevMessages) => [
          ...prevMessages,
          { text: data.message, isSender: false },
        ]);
      }
    };

    socket.on("receive_message", handleReceiveMessage);
    return () => {
      socket.off("receive_message", handleReceiveMessage);
    };
  }, [room]);

  const handleMessageSubmit = useCallback(
    (e: any) => {
      e.preventDefault();
      const newMessage = e.currentTarget.message.value.trim();
      if (newMessage.length > 0) {
        sendMessage(newMessage);
        setMessages((prevMessages) => [
          ...prevMessages,
          { text: newMessage, isSender: true },
        ]);
        e.currentTarget.message.value = "";
      }
    },
    [sendMessage]
  );

  useEffect(() => {
    viewport.current!.scrollTo({
      top: viewport.current!.scrollHeight,
      behavior: "smooth",
    });
  }, [messages]);

  return (
    <>
      <Flex
        direction={"column"}
        h={"100vh"}
        justify={"end"}
        bg={"#7E7F9A"}
        p={20}
      >
        <Group p={10} justify="center">
          <Button onClick={() => router.back()}>Back</Button>
          <Title
            style={{
              fontFamily: "sans-serif",
              color: "#EB9486",
              fontWeight: 600,
            }}
          >
            {`${game}`}
          </Title>
        </Group>

        <ScrollArea
          bg={"white"}
          w={"100%"}
          h={"100%"}
          p={10}
          style={{ borderRadius: "10px", flexGrow: 1 }}
          viewportRef={viewport}
        >
          <Stack gap={10} pr={20}>
            {messages.map((msg, index) => (
              <Flex
                key={index}
                direction="row"
                justify={msg.isSender ? "end" : "start"}
              >
                <Text
                  style={{
                    background: msg.isSender ? "#D6EEF1" : "#F3D250",
                    borderRadius: "5px",
                    padding: 10,
                  }}
                >
                  {msg.text}
                </Text>
              </Flex>
            ))}
          </Stack>
        </ScrollArea>

        <form onSubmit={handleMessageSubmit}>
          <Flex direction={"row"} gap={10} p={5}>
            <TextInput
              name="message"
              flex={1}
              placeholder="Type your message here and press Enter"
            />
            <Button type="submit">Send</Button>
          </Flex>
        </form>
      </Flex>
    </>
  );
}

const Loading = () => <div>Loading...</div>;

export default function Finder() {
  return (
    <Suspense fallback={<Loading />}>
      <FinderComponent />
    </Suspense>
  );
}

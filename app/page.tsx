"use client";
import { Box, Button, Flex, Stack, TextInput, Title } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";

export default function Home() {
  const router = useRouter();
  const [game, setGame] = useState("");

  return (
    <>
      <Flex direction={"column"} h={"100vh"}>
        <Flex
          direction={"row"}
          justify={"center"}
          align={"center"}
          bg={"#7E7F9A"}
          flex={1}
          p={20}
          // h={"100%"}
        >
          <Stack bg={"#F9F8F8"} p={100} style={{ borderRadius: "10px" }}>
            <Flex direction={"row"} justify={"center"}>
              <Image src={"/aim.png"} alt="aim" width={100} height={100} />
            </Flex>
            <Title
              style={{
                fontFamily: "sans-serif",
                color: "#EB9486",
                fontWeight: 600,
              }}
            >
              GAMEMATE FINDER
            </Title>
            <TextInput
              placeholder="type your game"
              onChange={(e) => {
                setGame(e.target.value);
              }}
            />
            <Button
              onClick={() => {
                if (game === "") {
                  console.log("error");
                } else {
                  router.push(`/finder?game=${game}`);
                  console.log(game);
                }
              }}
            >
              Find Match
            </Button>
          </Stack>
        </Flex>
      </Flex>
    </>
  );
}

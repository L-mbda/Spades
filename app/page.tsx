"use client";
import { Modal, NumberInput, TextInput } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import Link from "next/link";
import { BiSolidZap } from "react-icons/bi";

export default function Spades() {
  const [opened, { open, close }] = useDisclosure(false);

  return (
    <>
      {/* Game Start Configuration Modal */}
      <Modal
        opened={opened}
        onClose={close}
        title={
          <span className="font-extrabold flex gap-2 items-center justify-center text-[21px]">
            <BiSolidZap /> Configure your match
          </span>
        }
        centered
        className="bg-zinc-800 dark:text-white"
      >
        <Modal.Body>
          <i>
            Prefer the old experience? Visit{" "}
            <Link href="/old" className="underline">
              here
            </Link>
            .
          </i>
          <br />
          <form>
            <br />
            <TextInput
              label="Match Name"
              radius={"xl"}
              className="gap-3 flex flex-col"
              placeholder="Midnight Series #3"
              name="match_name"
            />
            <br />
            <NumberInput
              label="Team Count"
              defaultValue={2}
              radius={"xl"}
              placeholder="2"
              onChange={(value) => {
                // @ts-ignore
                // setTeamCount(parseInt(value));
              }}
              min={2}
              required
            />
          </form>
        </Modal.Body>
      </Modal>

      {/* Landing */}
      <div className="text-white bg-gradient-to-br from-blue-600 via-blue-800 to-blue-950 h-screen w-screen flex flex-col gap-8 items-center justify-center px-4">
        {/* Title */}
        <h1 className="text-7xl font-black font-[Mulish] tracking-tight drop-shadow-lg">
          Spades
        </h1>

        {/* Subtitle */}
        <p className="text-lg md:text-xl font-['DM Sans'] max-w-xl text-center opacity-90 leading-relaxed">
          A sleek and simple card tracker designed for your Spades games. Keep
          score effortlessly with style.
        </p>

        {/* Call-to-action button */}
        <button
          className="bg-emerald-600 hover:bg-emerald-700 border border-emerald-400 hover:border-emerald-300 transition-all duration-300 shadow-lg hover:shadow-emerald-600/30 text-white font-semibold font-[Mulish] py-3 px-8 rounded-2xl text-lg tracking-wide"
          onClick={(event) => {
            event.preventDefault();
            open();
            // Open modal
          }}
        >
          Start Game
        </button>

        {/* Decorative card preview */}
        <div className="absolute bottom-8 flex gap-4 opacity-40">
          <Link
            href={"/old"}
            className="w-16 h-24 rounded-xl hover:bg-emerald-600 transition-all duration-500 bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center text-2xl"
          >
            ♠
          </Link>
          <Link
            href={"/old"}
            className="w-16 h-24 rounded-xl hover:bg-emerald-600 transition-all duration-500 bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center text-2xl"
          >
            ♥
          </Link>
          <Link
            href={"/old"}
            className="w-16 h-24 rounded-xl hover:bg-emerald-600 transition-all duration-500 bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center text-2xl"
          >
            ♦
          </Link>
          <Link
            href={"/old"}
            className="w-16 h-24 rounded-xl hover:bg-emerald-600 transition-all duration-500 bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center text-2xl"
          >
            ♣
          </Link>
        </div>
      </div>
    </>
  );
}

import Image from "next/image";
import React from "react";
import { FaXmark } from "react-icons/fa6";

type Props = {
  url: string;
  setImgClicked: React.Dispatch<React.SetStateAction<boolean>>;
};

const OpenImage = ({ url, setImgClicked }: Props) => {
  return (
    <>
      <div
        onClick={() => setImgClicked(false)}
        className="bg-black opacity-80 z-40 fixed left-0 top-0 min-h-screen w-full"
      ></div>
      <Image
        src={url}
        alt="zoom"
        width={500}
        height={500}
        className="z-40 max-h-full max-w-full object-contain fixed left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 transition-transform duration-500"
      />
      <FaXmark
        className="z-50 fixed top-4 right-4 text-2xl text-white"
        onClick={() => setImgClicked(false)}
      />
    </>
  );
};

export default OpenImage;

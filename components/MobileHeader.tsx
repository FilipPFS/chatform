import Image from "next/image";
import Link from "next/link";
import React from "react";

const MobileHeader = ({ avatar }: { avatar: string }) => {
  return (
    <header className="sm:hidden flex items-center justify-between bg-custom-gradient px-6 h-20">
      <Link href={"/"}>
        <Image
          src={"/images/logo-icon-white.png"}
          alt="logo"
          width={60}
          height={60}
        />
      </Link>
      <Link href={"/my-account"}>
        <Image
          src={avatar}
          alt="logo"
          width={45}
          height={45}
          className="rounded-full"
        />
      </Link>
    </header>
  );
};

export default MobileHeader;

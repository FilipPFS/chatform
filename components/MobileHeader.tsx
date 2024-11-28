import Image from "next/image";
import Link from "next/link";
import React from "react";

const MobileHeader = () => {
  return (
    <header className="sm:hidden flex items-center bg-custom-gradient px-6 h-20">
      <Link href={"/"}>
        <Image
          src={"/images/logo-icon-white.png"}
          alt="logo"
          width={60}
          height={60}
        />
      </Link>
    </header>
  );
};

export default MobileHeader;

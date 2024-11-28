import Image from "next/image";
import React from "react";

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex min-h-screen">
      <section className="bg-custom-gradient text-white p-10 hidden w-1/2 items-center justify-center lg:flex xl:w-2/5">
        <div className="flex max-h-[800px] max-w-[430px] flex-col justify-center space-y-12">
          <h2 className="text-3xl font-semibold">Welcome To</h2>
          <Image
            src={"/images/logo-white.png"}
            alt="logo"
            width={340}
            height={340}
          />
          <p className="w-4/5 text-lg">
            The only platform that you need to chat with your friends!
          </p>
        </div>
      </section>

      <section className="flex flex-1 flex-col items-center bg-white p-1 py-10 lg:justify-center lg:p-10 lg:py-0">
        <div className="mb-16 lg:hidden">
          <Image
            src={"/images/logo-blue.png"}
            alt="logo"
            width={170}
            height={170}
          />
        </div>

        {children}
      </section>
    </div>
  );
};

export default Layout;

import React from "react";
import Image from "next/image";

const About = () => {
  return (
    <div className="relative grid gap-14 justify-center pt-44 text-center">
      <div>
        <Image
          src={"/images/logo-cmw.png"}
          width={360}
          height={300}
          alt="logo-cmw"
        />
      </div>
      <div className="grid gap-6">
        <div className="grid gap-2 justify-center text-center">
          <div>Designed and developed by :</div>
          <div className="underline cursor-pointer text-xl">
            <a
              href="https://wildanrizkii.vercel.app"
              target="_blank"
              className="font-semibold hover:text-black hover:text-lg transition-all"
            >
              .wildanrizkii
            </a>
          </div>
        </div>
        <div className="grid gap-1 justify-center text-center">
          <div>Version :</div>
          <div>v1.0.1 | 20-02-2025</div>
        </div>
      </div>
    </div>
  );
};

export default About;

import { AppConfig } from "@/utils/AppConfig";
// import logo from "@/public/assets/invoice.svg";
// import Image from "next/image";

export const Logo = (props: { isTextHidden?: boolean }) => (
  <div className="flex items-center font-semibold">
    {/* <Image src={logo} width={20} height={20} /> */}
    {!props.isTextHidden && AppConfig.name}
  </div>
);

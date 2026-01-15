"use client";

import Link from "next/link";

import { useMenu } from "@/hooks/UseMenu";
import { cn } from "@/utils/Helpers";
import { NavigationMenu } from "@/components/ui/navigation-menu";
import { NavigationMenuList } from "@radix-ui/react-navigation-menu";
import { MobileMenu } from "./MobileMenu";

export const CenteredMenu = (props: {
  logo: React.ReactNode;
  children: React.ReactNode;
  rightMenu: React.ReactNode;
}) => {
  const { showMenu } = useMenu();

  const navClass = cn("max-lg:w-full max-lg:bg-secondary max-lg:p-5", {
    "max-lg:hidden": !showMenu,
  });

  return (
    <div className="flex flex-wrap items-center justify-between">
      <div className=" flex gap-2 items-center justify-center">
        <Link href="/">{props.logo}</Link>

        <div className=" max-lg:hidden">
          <NavigationMenu>
            <NavigationMenuList>{props.children}</NavigationMenuList>
          </NavigationMenu>
        </div>
      </div>
      <div className=" lg:hidden [&_button:hover]:opacity-100 [&_button]:opacity-60">
        <MobileMenu />
      </div>

      <div
        className={cn(
          "rounded-b max-lg:border-t max-lg:border-border",
          navClass
        )}
      >
        <ul className="flex flex-row items-center gap-x-2 font-medium">
          {props.rightMenu}
        </ul>
      </div>
    </div>
  );
};

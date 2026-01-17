import Link from "next/link";
import { useTranslations } from "next-intl";

import { LocaleSwitcher } from "@/components/LocaleSwitcher";
import { CenteredMenu } from "@/features/landing/CenteredMenu";
import { Section } from "@/features/landing/Section";

import { Logo } from "./Logo";
import {
  NavigationMenuItem,
  NavigationMenuLink,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { cn } from "@/utils/Helpers";
import { Button } from "@/components/ui/button";

export const Navbar = () => {
  const t = useTranslations("Navbar");

  return (
    <Section className="py-1 rounded-md border-b">
      <CenteredMenu
        logo={<Logo />}
        rightMenu={
          <>
            {/* PRO: Dark mode toggle button */}

            <LocaleSwitcher />

            <Button size={"sm"} asChild variant={"ghost"}>
              <Link href="/sign-in">{t("sign_in")}</Link>
            </Button>

            <Button asChild size={"sm"}>
              <Link href="/sign-up">{t("sign_up")}</Link>
            </Button>
          </>
        }
      >
        <div className=" flex flex-row max-lg:flex-col max-lg:block">
          <NavigationMenuItem>
            <NavigationMenuLink
              asChild
              className={cn(navigationMenuTriggerStyle(), "hover:bg-inherit")}
            >
              <Link href="/sign-up">{t("product")}</Link>
            </NavigationMenuLink>
          </NavigationMenuItem>

          <NavigationMenuItem>
            <NavigationMenuLink
              asChild
              className={cn(navigationMenuTriggerStyle(), "hover:bg-inherit")}
            >
              <Link href="/docs">{t("docs")}</Link>
            </NavigationMenuLink>
          </NavigationMenuItem>

          {/* <NavigationMenuItem>
            <Link href="/blog" legacyBehavior passHref>
              <NavigationMenuLink
                className={cn(navigationMenuTriggerStyle(), "hover:bg-inherit")}
              >
                {t("blog")}
              </NavigationMenuLink>
            </Link>
          </NavigationMenuItem> */}

          <NavigationMenuItem>
            <NavigationMenuLink
              asChild
              className={cn(navigationMenuTriggerStyle(), "hover:bg-inherit")}
            >
              <Link href="/pages/about">{t("company")}</Link>
            </NavigationMenuLink>
          </NavigationMenuItem>
        </div>
      </CenteredMenu>
    </Section>
  );
};

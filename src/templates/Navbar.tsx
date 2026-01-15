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
            <Link href="/sign-up" legacyBehavior passHref>
              <NavigationMenuLink
                className={cn(navigationMenuTriggerStyle(), "hover:bg-inherit")}
              >
                {t("product")}
              </NavigationMenuLink>
            </Link>
          </NavigationMenuItem>

          <NavigationMenuItem>
            <Link href="/docs" legacyBehavior passHref >
              <NavigationMenuLink
                className={cn(navigationMenuTriggerStyle(), "hover:bg-inherit")}
              >
                {t("docs")}
              </NavigationMenuLink>
            </Link>
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
            <Link href="/pages/about" legacyBehavior passHref>
              <NavigationMenuLink
                className={cn(navigationMenuTriggerStyle(), "hover:bg-inherit")}
              >
                {t("company")}
              </NavigationMenuLink>
            </Link>
          </NavigationMenuItem>
        </div>
      </CenteredMenu>
    </Section>
  );
};

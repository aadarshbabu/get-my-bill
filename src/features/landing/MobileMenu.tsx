import { ToggleMenuButton } from "@/components/ToggleMenuButton";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useMenu } from "@/hooks/UseMenu";
import { AppConfig } from "@/utils/AppConfig";
import { useTranslations } from "next-intl";
import Link from "next/link";

export function MobileMenu() {
  const { handleToggleMenu } = useMenu();
  const t = useTranslations("Navbar");

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div>
          <ToggleMenuButton onClick={handleToggleMenu} />;
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-80">
        <DropdownMenuLabel asChild>
          <Link href="/">{AppConfig.name}</Link>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem asChild>
            <Link href="/docs">{t("docs")}</Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href="/blog">{t("blog")}</Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href="/pages/about">{t("company")}</Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href="/product">{t("product")}</Link>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <Link href="/sign-in">{t("sign_in")}</Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem>Log out</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

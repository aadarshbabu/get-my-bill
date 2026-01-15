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
        <DropdownMenuLabel>
          <Link href="/" legacyBehavior passHref>
            {AppConfig.name}
          </Link>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem>
            <Link href="/docs" legacyBehavior passHref>
              {t("docs")}
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Link href="/blog" legacyBehavior passHref>
              {t("blog")}
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Link href="/pages/about" legacyBehavior passHref>
              {t("company")}
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Link href="/product" legacyBehavior passHref>
              {t("product")}
            </Link>
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

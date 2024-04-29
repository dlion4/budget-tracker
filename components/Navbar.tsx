"use client";

import { usePathname } from "next/navigation";
import Logo from "./Logo";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Button, buttonVariants } from "./ui/button";
import { UserButton } from "@clerk/nextjs";
import ThemeSwitcherBtn from "./ThemeSwitcherBtn";
import { useState } from "react";
import { Sheet, SheetContent, SheetTrigger } from "./ui/sheet";
import { Key, Menu } from "lucide-react";
import LogoMobile from "./Logo";
type ItemProps = {
  label: string;
  link: string;
};
const items: ItemProps[] = [
  {
    label: "Dashboard",
    link: "/"
  }, {
    label: "Transactions",
    link: "/transactions"
  }, {
    label: "Manage",
    link: "/manage"
  }
];

const Navbar = () => {
  return (<> < DesktopNavbar /> <MobileNavbar />
  </>);
};
export default Navbar;

function DesktopNavbar() {
  return (<div className="hidden md:block border-separate border-b bg-background">
    <nav className="container flex items-center justify-between px-8">
      <div className="flex h-[80px] min-h-[60px] items-center gap-x-4">
        <Logo />
        <div className="flex h-full">
          {items.map((item) => (<NavbarItem key={item.label} item={item} />))}
        </div>
      </div>
      <div className="flex items-center gap-2">
        <ThemeSwitcherBtn />
        <UserButton afterSignOutUrl="/sign-in" />
      </div>
    </nav>
  </div>);
}
function NavbarItem({ item, onClick }: {
  item: ItemProps;
  onClick?: () => void;
}) {
  const pathname = usePathname();
  const isActive = pathname == item.link;

  return (<div className="relative flex items-center">
    <Link href={item.link} className={cn(buttonVariants({ variant: "ghost" }), "w-full justify-start text-lg text-muted-foreground hover:text-foreground", isActive && "text-foreground")} onClick={() => {
      if (onClick)
        onClick();
    }}>
      {item.label}
    </Link>

    {isActive && (<div className="absolute -bottom-[2px] left-1/2 hidden h-[2px] w-[80%] -translate-x-1/2 rounded-xl bg-foreground md:block" />)}
  </div>);
}
function MobileNavbar() {
  const [isOpen, setIsOpen] = useState(false);
  return (<div className="block border-separate bg-background md:hidden">
    <div className="container flex items-center justify-between px-8">
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild="asChild">
          <Button variant={"ghost"} size={"icon"}>
            <Menu />
          </Button>
        </SheetTrigger>

        <SheetContent className="w-[350px] sm:w-[400px]" side={"left"}>
          <div className="gap-1 ml-3">
            <LogoMobile />
          </div>
          <div className="flex flex-col gap-1 pt-4">
            {items.map((item) => (<NavbarItem key={item.label} item={item} onClick={() => setIsOpen((prev) => !prev)} />))}
          </div>
        </SheetContent>
      </Sheet>
      <div className="flex h-[80px] min-h-[60px] items-center gap-x-4">
        <LogoMobile />
      </div>
      <div className="flex items-center gap-2">
        <ThemeSwitcherBtn />
        <UserButton afterSignOutUrl="/sign-in" />
      </div>
    </div>
  </div>);
}

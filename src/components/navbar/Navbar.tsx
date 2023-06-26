import React from "react";
import Logo from "./Logo";
import { Navlink } from "./Navlink";
import { NavItem } from "@/components/types";
import Container from "../shared/Container";
import { api } from "@/utils/api";
import { Button } from "../ui/button";
import UserMenu from "./UserMenu";
import useLoginModal from "@/hooks/useLoginModal";
import Link from "next/link";

const Navbar = () => {
  const { data } = api.user.getUser.useQuery();

  const loginModal = useLoginModal();
  return (
    <div className="fixed z-50 w-full bg-white shadow-sm ">
      <div className="border-b py-2">
        <Container>
          <div className="flex flex-row items-center justify-between gap-3 md:gap-0">
            <div className="flex items-center gap-2">
              <Link href="/">
                <Logo />
              </Link>
              <Navlink items={NavItem} />
            </div>
            {!data ? (
              <Button
                className="bg-rose-600 duration-300 hover:bg-rose-500 active:scale-90"
                onClick={loginModal.onOpen}
              >
                Login
              </Button>
            ) : (
              <UserMenu />
            )}
          </div>
        </Container>
      </div>
    </div>
  );
};

export default Navbar;

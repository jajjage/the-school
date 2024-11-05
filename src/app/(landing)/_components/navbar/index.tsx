import GlassSheet from "@/components/global/glass-sheet"
import { Button } from "@/components/ui/button"
import { Logout } from "@/icons/logout"
import { MenuIcon } from "lucide-react"
import Link from "next/link"
import Menu from "./menu"

type Props = {}

const LandingPageNavbar = (props: Props) => {
  return (
    <div className="w-full flex justify-between sticky top-0 items-center py-5 z-50">
      <p className="font-bold text-2xl">Grouple.</p>
      <Menu orientation="desktop" />

      <div className="flex gap-2">
        {/* <ThemeToggler /> */}
        <Link href="/sign-in">
          <Button
            variant="outline"
            className="bg-themeBlack lg:flex hidden rounded-2xl  gap-2 border-themeGray hover:bg-themeGray"
          >
            <Logout />
            Login
          </Button>
        </Link>
        <GlassSheet
          triggerClass="lg:hidden"
          trigger={
            <Button variant="ghost" className="hover:bg-transparent">
              <MenuIcon size={30} />
            </Button>
          }
        >
          <p className="font-bold text-2xl">Grouple.</p>
          <Menu orientation="mobile" />
          <div className="flex gap-2 justify-end">
            <Link href="/sign-in">
              <Button
                variant="outline"
                className="bg-themeBlack rounded-2xl flex gap-2 border-themeGray hover:bg-themeGray"
              >
                <Logout />
                Login
              </Button>
            </Link>
          </div>
        </GlassSheet>
      </div>
    </div>
  )
}

export default LandingPageNavbar

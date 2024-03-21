import { Link } from "react-router-dom";
import { JWT_TOKEN_STORAGE_KEY, USER_STORAGE_KEY } from "../constants";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
} from "@/components/ui/navigation-menu"
import { Button } from "@/components/ui/button"

const Nav = ({ user, setUser }) => {

  const logout = () => {
    // Clearing user details and JWT on logout
    if (user) {
      localStorage.removeItem(USER_STORAGE_KEY);
      localStorage.removeItem(JWT_TOKEN_STORAGE_KEY);
      setUser(null);
    }
  }

  return (
    <nav className="flex justify-between p-5">
      <div></div>

      <NavigationMenu>
        <NavigationMenuList>
          {user?
            (
              <>
                <NavigationMenuItem>
                  <Button variant="ghost" asChild>
                    <Link to="/">Home</Link>
                  </Button>
                </NavigationMenuItem>

                <NavigationMenuItem>
                  <Button variant="ghost" asChild>
                    <Link to="/login" onClick={logout}>Logout</Link>
                  </Button>
                </NavigationMenuItem>
              </>
            ) : (
              <>
                <NavigationMenuItem>
                  <Button variant="ghost" asChild>
                    <Link to="/login">Login</Link>
                  </Button>
                </NavigationMenuItem>

                <NavigationMenuItem>
                  <Button variant="ghost" asChild>
                    <Link to="/registration">Registration</Link>
                  </Button>
                </NavigationMenuItem>
              </>
            )
          }
        </NavigationMenuList>
      </NavigationMenu>
    </nav>
  )
}

export default Nav
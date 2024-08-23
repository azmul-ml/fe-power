import { useEffect, useState } from "react";
import { IconLogout } from "@tabler/icons-react";
import { MENU_ITEMS } from "../menu-list/MenuList";
import { useNavigate, useLocation } from "react-router-dom";
import { logout } from "@/identity/helpers";
import classes from "./Navbar.module.scss";

const data = [...MENU_ITEMS];

export default function NavbarSimple() {
  const navigate = useNavigate();
  const location = useLocation();

  const [active, setActive] = useState(location.pathname);

  const links = data.map((item) => (
    <a
      className={classes.link}
      data-active={item.link === active || undefined}
      href={item.link}
      key={item.link}
      onClick={(event) => {
        event.preventDefault();
        setActive(item.link);
        navigate(item.link);
      }}
    >
      <item.icon className={classes.linkIcon} stroke={1.5} />
      <span>{item.label}</span>
    </a>
  ));

  useEffect(() => {
    setActive(location.pathname);
  }, [location.pathname]);

  return (
    <nav className={classes.navbar}>
      <div className={classes.navbarMain}>{links}</div>

      <div className={classes.footer}>
        {/* <a
          href="#"
          className={classes.link}
          onClick={(event) => event.preventDefault()}
        >
          <IconSwitchHorizontal className={classes.linkIcon} stroke={1.5} />
          <span>Change account</span>
        </a> */}

        <a
          href="#"
          className={classes.link}
          onClick={(event) => {
            event.preventDefault();
            logout();
          }}
        >
          <IconLogout className={classes.linkIcon} stroke={1.5} />
          <span>Logout</span>
        </a>
      </div>
    </nav>
  );
}

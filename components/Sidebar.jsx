import Logout from "@mui/icons-material/Logout";
import Avatar from "@mui/material/Avatar";
import SettingsIcon from "@mui/icons-material/Settings";
import Divider from "@mui/material/Divider";
import ListItemIcon from "@mui/material/ListItemIcon";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { signOut } from "next-auth/react";
import Link from "next/link";
import React from "react";
import {
  AiOutlineCalendar,
  AiOutlineHome,
  AiOutlineUser,
  AiTwotoneCalendar,
  AiFillQuestionCircle,
} from "react-icons/ai";
import NavLink from "./NavLink";

const Sidebar = ({ navbarOpen, setNavbarOpen }) => {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <div
        className={`flex-col items-center w-40 h-full overflow-hidden text-gray-700 bg-white ${
          navbarOpen ? "flex fixed md:static left-0 top-0 z-50" : "hidden"
        } md:flex`}
      >
        <a className="flex items-center justify-center w-full px-3 py-4 cursor-pointer">
          <svg
            className="w-8 h-8 fill-current"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path d="M11 17a1 1 0 001.447.894l4-2A1 1 0 0017 15V9.236a1 1 0 00-1.447-.894l-4 2a1 1 0 00-.553.894V17zM15.211 6.276a1 1 0 000-1.788l-4.764-2.382a1 1 0 00-.894 0L4.789 4.488a1 1 0 000 1.788l4.764 2.382a1 1 0 00.894 0l4.764-2.382zM4.447 8.342A1 1 0 003 9.236V15a1 1 0 00.553.894l4 2A1 1 0 009 17v-5.764a1 1 0 00-.553-.894l-4-2z" />
          </svg>
          <span className="ml-2 text-sm font-bold">The App</span>
        </a>
        <div className="w-full px-2">
          <div className="flex flex-col items-center w-full border-t border-gray-300">
            <NavLink
              href="/"
              exact={true}
              className="flex items-center w-full h-12 px-3 mt-2 rounded hover:bg-gray-300"
            >
              <AiOutlineHome className="w-6 h-6 stroke-current" />
              <span className="ml-2 text-sm font-medium">Главная</span>
            </NavLink>

            <NavLink
              className="flex items-center w-full h-12 px-3 mt-2 rounded hover:bg-gray-300"
              href="/schedule"
            >
              <AiTwotoneCalendar className="w-6 h-6 stroke-current" />
              <span className="ml-2 text-sm font-medium">Расписание</span>
            </NavLink>

            <NavLink
              className="flex items-center w-full h-12 px-3 mt-2 rounded hover:bg-gray-300"
              href="/calendar"
            >
              <AiOutlineCalendar className="w-6 h-6 stroke-current" />
              <span className="ml-2 text-sm font-medium">Календарь</span>
            </NavLink>

            <NavLink
              className="flex items-center w-full h-12 px-3 mt-2 rounded hover:bg-gray-300"
              href="/quizzes"
            >
              <AiFillQuestionCircle className="w-6 h-6 stroke-current" />
              <span className="ml-2 text-sm font-medium">Тесты</span>
            </NavLink>
          </div>
          {/* <div className="flex flex-col items-center w-full mt-2 border-t border-gray-300">
        </div> */}
        </div>
        <a
          className="flex items-center justify-center w-full h-16 mt-auto bg-gray-200 hover:bg-gray-300 cursor-pointer"
          onClick={handleClick}
        >
          <AiOutlineUser className="w-6 h-6 stroke-current" />
          <span className="ml-2 text-sm font-medium">Аккаунт</span>
        </a>
      </div>
      <Menu
        anchorEl={anchorEl}
        id="account-menu"
        open={open}
        onClose={handleClose}
        onClick={handleClose}
        PaperProps={{
          elevation: 0,
          sx: {
            overflow: "visible",
            filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
            mt: 1.5,
            "& .MuiAvatar-root": {
              width: 32,
              height: 32,
              ml: -0.5,
              mr: 1,
            },
            "&:before": {
              content: '""',
              display: "block",
              position: "absolute",
              top: 0,
              right: 14,
              width: 10,
              height: 10,
              bgcolor: "background.paper",
              transform: "translateY(-50%) rotate(45deg)",
              zIndex: 0,
            },
          },
        }}
        transformOrigin={{ horizontal: "right", vertical: "bottom" }}
        anchorOrigin={{ horizontal: "right", vertical: "top" }}
      >
        <Link href="/profile">
          <a>
            <MenuItem>
              <Avatar /> Мой профиль
            </MenuItem>
          </a>
        </Link>
        <Link href="/edit-profile">
          <a>
            <MenuItem>
              <Avatar>
                <SettingsIcon />
              </Avatar>{" "}
              Изменить
            </MenuItem>
          </a>
        </Link>
        <Divider />
        <MenuItem
          onClick={() => signOut({ redirect: true, callbackUrl: "/login" })}
        >
          <ListItemIcon>
            <Logout fontSize="small" />
          </ListItemIcon>
          Выйти
        </MenuItem>
      </Menu>
    </>
  );
};

export default Sidebar;

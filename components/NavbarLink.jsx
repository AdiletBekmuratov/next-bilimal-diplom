import Link from "next/link";
import React from "react";

const NavbarLink = ({ href, condition, name, onClick }) => {
  if (!condition) {
    return null;
  }

  return (
    <li className="nav-item" onClick={onClick}>
      <Link
        className="px-3 py-2 flex items-center text-lg hover:opacity-75"
        href={href}
      >
        <a>{name}</a>
      </Link>
    </li>
  );
};

export default NavbarLink;

import { useRouter } from "next/router";
import Link from "next/link";

export default function NavLink({
  href,
  exact,
  condition = true,
  children,
  ...props
}) {
  if (!condition) {
    return null;
  }
  const { pathname } = useRouter();
  const isActive = exact ? pathname === href : pathname.startsWith(href);

  if (isActive) {
    props.className += " active bg-gray-300";
  }

  return (
    <Link href={href}>
      <a {...props}>{children}</a>
    </Link>
  );
}

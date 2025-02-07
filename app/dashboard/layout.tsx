// TODO: Add a layout for the shop page

import { ReactNode } from "react";

interface LayoutProps {
  children: ReactNode;
  userId: string;
}

const Layout = ({ children }: LayoutProps) => {
  return <div>{children}</div>;
};

export default Layout;

import { useSuspenseQuery } from "@tanstack/react-query";
import type { ReactNode } from "react";

import { meQueries } from "../../me";
import { spacesQueries } from "../queries";
import { Sidebar } from "./Sidebar/Sidebar";
import styles from "./SpaceLayout.module.css";

type SpaceLayoutProps = {
  children: ReactNode;
  spaceId: string;
};

export const SpaceLayout = ({ children, spaceId }: SpaceLayoutProps) => {
  const { data: space } = useSuspenseQuery(spacesQueries.detail(spaceId));
  const { data: user } = useSuspenseQuery(meQueries.current());

  return (
    <div className={styles.layout}>
      <Sidebar spaceId={spaceId} spaceName={space.name} user={user} />
      {children}
    </div>
  );
};

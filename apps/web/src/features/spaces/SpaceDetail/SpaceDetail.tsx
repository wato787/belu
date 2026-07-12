import { useSuspenseQuery } from "@tanstack/react-query";

import { meQueries } from "../../me";
import { spacesQueries } from "../queries";
import { Main } from "./Main/Main";
import styles from "./SpaceDetail.module.css";
import { Sidebar } from "./Sidebar/Sidebar";

type SpaceDetailProps = {
  spaceId: string;
};

export const SpaceDetail = ({ spaceId }: SpaceDetailProps) => {
  const { data: space } = useSuspenseQuery(spacesQueries.detail(spaceId));
  const { data: user } = useSuspenseQuery(meQueries.current());

  return (
    <div className={styles.page}>
      <Sidebar spaceId={spaceId} spaceName={space.name} user={user} />
      <Main />
    </div>
  );
};

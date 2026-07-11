import { useState } from "react";

import { SpaceCreateForm } from "./SpaceCreateForm/SpaceCreateForm";
import { SpaceList } from "./SpaceList/SpaceList";

export const Spaces = () => {
  const [mode, setMode] = useState<"list" | "create">("list");

  if (mode === "create") {
    return <SpaceCreateForm onBack={() => setMode("list")} />;
  }

  return <SpaceList onCreateClick={() => setMode("create")} />;
};

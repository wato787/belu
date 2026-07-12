import { useState } from "react";

import { CreateForm } from "./CreateForm/CreateForm";
import { List } from "./List/List";

export const Spaces = () => {
  const [mode, setMode] = useState<"list" | "create">("list");

  if (mode === "create") {
    return <CreateForm onBack={() => setMode("list")} />;
  }

  return <List onCreateClick={() => setMode("create")} />;
};

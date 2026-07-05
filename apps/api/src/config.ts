export type AppEnvironment = "development" | "staging" | "production";

export type AppBindings = {
  APP_ENV?: AppEnvironment;
  DB: D1Database;
};

export type AppConfig = {
  app: {
    env: AppEnvironment;
  };
  database: {
    binding: D1Database;
  };
};

export type AppHonoEnv = {
  Bindings: AppBindings;
};

export const getConfig = (bindings: AppBindings): AppConfig => ({
  app: {
    env: bindings.APP_ENV ?? "development",
  },
  database: {
    binding: bindings.DB,
  },
});

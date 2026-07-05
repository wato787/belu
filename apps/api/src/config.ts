export type AppEnvironment = "development" | "staging" | "production";

export type AppBindings = {
  APP_ENV?: AppEnvironment;
};

export type AppConfig = {
  app: {
    env: AppEnvironment;
  };
};

export type AppHonoEnv = {
  Bindings: AppBindings;
};

export const getConfig = (bindings: AppBindings): AppConfig => ({
  app: {
    env: bindings.APP_ENV ?? "development",
  },
});

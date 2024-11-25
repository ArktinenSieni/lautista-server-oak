export type ApplicationState = {
  auth?: Auth;
};

export type ApplicationStateAuthorized = ApplicationState & {
  auth: Auth;
};

export type Auth = {
  userId: string;
};


import { Response } from "express";

export interface AuthTokens {
  accessToken?: string;
  refreshToken?: string;
}

// const isProduction = envVars.NODE_ENV === "production";

export const setAuthCookie = (res: Response, tokenInfo: AuthTokens) => {
  if (tokenInfo.accessToken) {
    res.cookie("accessToken", tokenInfo.accessToken, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      expires: new Date(0),
      path: "/",
    });
  }
  if (tokenInfo.refreshToken) {
    res.cookie("refreshToken", tokenInfo.refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      expires: new Date(0),
      path: "/",
    });
  }
};

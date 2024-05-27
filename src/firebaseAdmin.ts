import type { NextApiRequest, NextApiResponse } from "next";
const { initializeApp, cert } = require("firebase-admin/app");
const { getAuth } = require("firebase-admin/auth");
const serviceAccount = require("./serviceAccountKey.json");
export type Req = NextApiRequest & {
  uid?: string;
  email?: string;
  params: {
    id?: string;
  };
};

initializeApp({ credential: cert(serviceAccount) });

export const verifyIdToken = async (
  req: Req,
  _: NextApiResponse,
  next: any
) => {
  const token = req.headers.authorization?.replace(/^Bearer\s/g, "");
  if (token) {
    const user = await getAuth().verifyIdToken(token);
    req.uid = user.uid;
    req.email = user.email;
  }
  next();
};

import mysql from "mysql";
import type { NextApiRequest, NextApiResponse } from "next";
import { initializeApp, cert, getApp, getApps } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import serviceAccount from "@/serviceAccountKey.json";

const connection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  stringifyObjects: true,
});

getApps().length === 0
  ? initializeApp({ credential: cert(serviceAccount as unknown as string) })
  : getApp();

export const handler = async (req: any, res: any) => {
  const token = req.headers.authorization?.replace(/^Bearer\s/g, "");
  if (token) {
    const user = await getAuth().verifyIdToken(token);
    req.uid = user.uid;
    req.email = user.email;
  }
  if (req.method === "POST") {
    connection.query(
      "select * from user where uid = ?",
      [req.uid],
      (error, results) => {
        if (error) {
          console.log(error);
          res.status(500).send("error");
          return;
        }
        if (results.length) {
          res.send("ok");
          return;
        }
        connection.query(
          "INSERT INTO user (uid) values(?)",
          [req.uid],
          (error, results) => {
            if (error) {
              console.log(error);
              res.status(500).send("error");
              return;
            }
            res.send("new user is created");
          }
        );
      }
    );
  }
};

export default handler;

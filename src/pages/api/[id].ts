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

import { Req } from "@/firebaseAdmin";

getApps().length === 0
  ? initializeApp({ credential: cert(serviceAccount as unknown as string) })
  : getApp();

export const handler = async (req: Req, res: NextApiResponse) => {
  const token = req.headers.authorization?.replace(/^Bearer\s/g, "");
  if (token) {
    const user = await getAuth().verifyIdToken(token);
    req.uid = user.uid;
    req.email = user.email;
  }

  if (req.method === "DELETE") {
    const { id } = req.query;
    connection.query(
      "delete from people where id = ? and uid = ?",
      [id, req.uid],
      (error, results) => {
        if (error) {
          console.log(error);
          res.status(500).send("error");
          return;
        }
        res.send("ok");
      }
    );
  } else if (req.method === "PUT") {
    const { id } = req.query;
    const updatePerson = {
      name: req.body.name,
      gender: req.body.gender,
      note: req.body.note,
      photo: req.body.photo,
      birth_date: req.body.bath_date,
    };
    connection.query(
      "update people set name = ?,gender=?,note=?,photo=?,birth_date=? where id = ? and uid = ?",
      [
        updatePerson.name,
        updatePerson.gender,
        updatePerson.note,
        updatePerson.photo,
        updatePerson.birth_date,
        id,
        req.uid,
      ],
      (error, results) => {
        if (error) {
          console.log(error);
          res.status(500).send("error");
          return;
        }
        res.send("ok");
      }
    );
  }
};

export default handler;

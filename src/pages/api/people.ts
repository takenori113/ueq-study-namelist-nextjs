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

type Req = NextApiRequest & {
  uid?: string;
  email?: string;
  params: {
    id?: string;
  };
  // body: {};
};

export const handler = async (req: Req, res: NextApiResponse) => {
  const token = req.headers.authorization?.replace(/^Bearer\s/g, "");
  if (token) {
    const user = await getAuth().verifyIdToken(token);
    req.uid = user.uid;
    req.email = user.email;
  }
  if (req.method === "GET") {
    connection.query(
      "SELECT * FROM people where uid = ?",
      [req.uid],
      (error: any, results: any) => {
        if (error) {
          console.log(error);
          res.status(500).send("error");
          return;
        }
        console.log(results);
        res.json(results);
      }
    );
  } else if (req.method === "POST") {
    const newPerson = {
      name: req.body.name,
      gender: req.body.gender,
      note: req.body.note,
      photo: req.body.photo,
      birth_date: req.body.bath_date,
      uid: req.body.uid,
    };
    connection.query(
      "INSERT INTO people (name,gender,note,photo,birth_date,uid) values(?,?,?,?,?,?)",
      [
        newPerson.name,
        newPerson.gender,
        newPerson.note,
        newPerson.photo,
        newPerson.birth_date,
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
  } else if (req.method === "DELETE") {
    console.log(req.params);
    const id = req.params.id;
    console.log(req.body);
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
  }
};

export default handler;

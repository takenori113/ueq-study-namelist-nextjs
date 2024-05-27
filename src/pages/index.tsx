import React from "react";
import { ref, uploadBytes } from "firebase/storage";
import PersonFormPart from "@/components/PersonFormPart";
import NameListItem from "@/components/NameListItem";
import { Person, User } from "@/types";
import { storage, auth, signOut } from "@/firebase";
const url = "http://localhost:3000";

type Target = {
  name: {
    value: string;
  };
  gender?: {
    value: string;
  };
  birth_date?: {
    value: string;
  };
  note?: {
    value: string;
  };
  photo?: {
    files: File[];
  };
};

export default function Home() {
  const [editPersonId, setEditPersonId] = React.useState("");
  const [people, setPeople] = React.useState<Person[]>([]);
  const [user, setUser] = React.useState<User | null | undefined>();

  React.useEffect(() => {
    auth.onAuthStateChanged((user) => {
      if (!user) {
        location.href = "/login";
      } else {
        const appUser = user as User;
        setUser(appUser);
        createUser();
        fetchPeople();
      }
    });
  }, []);

  const createUser = async () => {
    const idToken = await auth.currentUser?.getIdToken();
    await fetch(`${url}/api/createUser`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${idToken}`,
      },
    });
    console.log(idToken);
  };

  const handleAdd = async (data: Person) => {
    const idToken = await auth.currentUser?.getIdToken();
    await fetch(`${url}/api/people`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${idToken}`,
      },
      body: JSON.stringify(data),
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = await createData(e);
    await handleAdd(data);
    fetchPeople();
  };

  const createData = async (e: React.FormEvent<HTMLFormElement>) => {
    const user = auth.currentUser;
    let fileName = "";
    const target = e.target as unknown as Target;
    const file = target.photo?.files[0];
    if (file) {
      const ext = file.name.split(".").pop();
      fileName = `${Date.now()}.${ext}`;
      const filePath = `images/${fileName}`;
      const fileRef = ref(storage, filePath);
      await uploadBytes(fileRef, file);
    }
    const data = {
      name: target.name.value,
      gender: target.gender?.value,
      birthDate: target.birth_date?.value,
      note: target.note?.value,
      photo: fileName,
      uid: user?.uid,
    };
    return data;
  };

  const fetchPeople = async () => {
    const idToken = await auth.currentUser?.getIdToken();
    const res = await fetch(`${url}/api/people`, {
      headers: { Authorization: `Bearer ${idToken}` },
    });
    const data = await res.json();
    setPeople(data);
  };

  const handleDelete = async (id: string) => {
    const idToken = await auth.currentUser?.getIdToken();
    await fetch(`${url}/api/${id}`, {
      headers: { Authorization: `Bearer ${idToken}` },
      method: "DELETE",
    });
    fetchPeople();
  };

  const handleUpdate =
    (id: string) => async (e: React.FormEvent<HTMLFormElement>) => {
      const data = await createData(e);
      const idToken = await auth.currentUser?.getIdToken();
      await fetch(`${url}/api/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${idToken}`,
        },
        body: JSON.stringify(data),
      });
      fetchPeople();
    };

  return (
    <main className="">
      <div>
        <p>ログインユーザー{user?.email}</p>
        <button onClick={() => signOut(auth)}>サインアウト</button>
      </div>
      <div>
        <h1 className="text-5xl font-bold underline font-mono">人物名鑑</h1>
        <div>
          遠くの親戚などあまり会わない人を登録すると忘れないから便利だぞ
        </div>
      </div>
      <PersonFormPart onSubmit={handleSubmit} />
      <div>
        <h2>人物名鑑</h2>
        <div>
          <ul>
            {people.map((x) => (
              <NameListItem
                key={x.id}
                person={x}
                onClickDelete={() => handleDelete(x.id ?? "")}
                onClickEdit={() => setEditPersonId(x.id ?? "")}
                isEditing={x.id === editPersonId}
                onClickUpdate={handleUpdate(x.id ?? "")}
              />
            ))}
          </ul>
        </div>
        <div>
          <a href={"/login"}>ログイン画面へ</a>
        </div>
      </div>
    </main>
  );
}

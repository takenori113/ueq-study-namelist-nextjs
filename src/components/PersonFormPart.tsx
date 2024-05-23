import { Person } from "@/types";

type Props = {
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  person?: Person;
};

const PersonFormPart = ({ onSubmit, person }: Props) => {
  return (
    <div className="border-double border-4 border-indigo-600 rounded-lg m-6">
      <form id="add-from" onSubmit={onSubmit}>
        <div className="border-solid border-2 border-indigo-600 rounded-lg m-1">
          <label htmlFor="name" className="m-1">
            名前:
          </label>
          <input
            type="text"
            id="name"
            name="name"
            required
            placeholder="お名前を入力してください"
            defaultValue={person?.name}
            className="m-1"
          />
        </div>
        <div className="border-solid border-2 border-indigo-600 rounded-lg m-1">
          <label htmlFor="birthdate" className="m-1">
            生年月日:
          </label>
          <input
            className="m-1"
            type="date"
            id="birth_date"
            name="birth_date"
            defaultValue={person?.birthDate}
          />
        </div>
        <div className="border-solid border-2 border-indigo-600 rounded-lg m-1">
          <label className="m-1">性別:</label>
          <input
            className="m-1"
            type="radio"
            id="male"
            name="gender"
            value="male"
            defaultChecked={person?.gender === "male"}
          />
          <label htmlFor="male" className="m-1">
            男性
          </label>
          <input
            className="m-1"
            type="radio"
            id="female"
            name="gender"
            value="female"
            defaultChecked={person?.gender === "female"}
          />
          <label htmlFor="female" className="m-1">
            女性
          </label>
          <input
            type="radio"
            id="other"
            name="gender"
            value="other"
            defaultChecked={person?.gender === "other"}
          />
          <label htmlFor="other" className="m-1">
            その他
          </label>
        </div>
        <div className="border-solid border-2 border-indigo-600 rounded-lg m-1 flex items-start">
          <label htmlFor="note" className="m-1">
            備考:
          </label>
          <textarea
            className="m-1"
            id="note"
            name="note"
            rows={4}
            cols={50}
            maxLength={200}
            placeholder="備考を入力してください（最大200文字）"
            defaultValue={person?.note}
          ></textarea>
        </div>
        <div className="border-solid border-2 border-indigo-600 rounded-lg m-1">
          <label htmlFor="photo" className="m-1">
            顔写真:
          </label>
          <input
            type="file"
            id="photo"
            name="photo"
            accept="image/*"
            className="      file:mr-4 file:py-2 file:px-4
      file:rounded-full file:border-0
      file:text-sm file:font-semibold
      file:bg-violet-50 file:text-violet-700
      hover:file:bg-violet-100 m-1"
          />
        </div>
        <button
          type="submit"
          id="submit"
          className="border-solid border-2 border-indigo-600 rounded-lg m-1"
        >
          送信
        </button>
      </form>
    </div>
  );
};

export default PersonFormPart;

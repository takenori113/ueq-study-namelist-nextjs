import {
  auth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from "@/firebase";

export const LoginPage = () => {

  const handleSubmitSignIn = async (e: any) => {
    e.preventDefault();
    const email = e.target["user-email"].value;
    const password = e.target["user-pass"].value;
    try {
      await signInWithEmailAndPassword(auth, email, password);
      location.href = "/";
    } catch (error:any) {
      const errorMessage = error.message;
      alert("Error: " + errorMessage);
    }
  };

  const handleSubmitSignUp = async (e: any) => {
    e.preventDefault();
    const email = e.target["sign-up-email"].value;
    const password = e.target["sign-up-user-pass"].value;
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      location.href = "/";
    } catch (error:any) {
      const errorMessage = error.message;
      alert("Error: " + errorMessage);
    }
  };

  return (
    <>
      <div>
        <h1>ログインページ</h1>
      </div>
      <div>
        <h1>sign-in</h1>
        <form id="login-form" onSubmit={handleSubmitSignIn}>
          <input
            type="email"
            id="user-email"
            placeholder="Enter email"
            required
          />
          <input
            type="password"
            id="user-pass"
            placeholder="Password"
            required
          />
          <button type="submit" className="dark:md:hover:bg-fuchsia-600">Login</button>
        </form>
        <h1>sign-up</h1>
        <form id="sign-up-form" onSubmit={handleSubmitSignUp}>
          <input
            type="email"
            id="sign-up-email"
            placeholder="Enter email"
            required
          />
          <input
            type="password"
            id="sign-up-user-pass"
            placeholder="Password"
            required
          />
          <button type="submit">Login</button>
        </form>
      </div>
    </>
  );
};

export default LoginPage;

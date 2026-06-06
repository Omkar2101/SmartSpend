import {
  SignedIn,
  SignedOut,
  SignInButton,
  UserButton,
  useAuth
} from "@clerk/clerk-react";
import { getCurrentUser } from "./api/user.api";

function App() {
   const { getToken } = useAuth();
   

  const testApi = async () => {

    const token =
      await getToken();
      console.log("Clerk token:", token);

    const result =
      await getCurrentUser(
        token!
      );

    console.log("the result:", result);

  };

  return (
    <div style={{ padding: "20px" }}>
      <SignedOut>
        <SignInButton />
      </SignedOut>

      <SignedIn>
        <UserButton />

       <div>


      <button
        onClick={testApi}
      >
        Get Token
      </button>

    </div>
      </SignedIn>
    </div>
  );
}

export default App;
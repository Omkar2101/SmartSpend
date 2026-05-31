import {
  SignedIn,
  SignedOut,
  SignInButton,
  UserButton,
  useUser,
} from "@clerk/clerk-react";

function App() {
  const { user } = useUser();

  return (
    <div style={{ padding: "20px" }}>
      <SignedOut>
        <SignInButton />
      </SignedOut>

      <SignedIn>
        <UserButton />

        <h2>Welcome {user?.fullName}</h2>

        <p>Email: {user?.primaryEmailAddress?.emailAddress}</p>

        <p>Clerk ID: {user?.id}</p>
      </SignedIn>
    </div>
  );
}

export default App;
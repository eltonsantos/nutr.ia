import LoginForm from "./components/LoginForm";
import LoginGoogle from "./components/LoginGoogle";

export default function Home() {
  return (
    <main>
      <div className="flex justify-center items-center h-screen bg-gray-100 px-5">
        <div className="bg-green-300 p-12 rounded-lg w-96 max-w-full flex justify-center items-center flex-col gap-2">
          <LoginForm />
          <LoginGoogle />
        </div>
      </div>
    </main>
  );
}
import { useAuth } from "../../contexts/useAuth";

function Profile() {
  const { user, signOut } = useAuth();

  // O ProtectedRoute já garantiu que estamos autenticados, mas o TS não sabe
  if (!user) return null;

  // Pega a primeira letra do nome (para o avatar)
  const initial = user.name.trim().charAt(0).toUpperCase();

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-6 bg-gray-50">
      {/* Avatar com inicial */}
      <div className="flex h-20 w-20 items-center justify-center rounded-full bg-purple-600 text-3xl font-bold text-white">
        {initial}
      </div>

      {/* Nome e email */}
      <div className="flex flex-col items-center gap-1">
        <h1 className="text-2xl font-semibold text-gray-900">{user.name}</h1>
        <p className="text-sm text-gray-600">{user.email}</p>
      </div>

      {/* Botão de sair */}
      <button
        onClick={signOut}
        className="mt-4 rounded-lg bg-gray-500 px-6 py-2 font-semibold text-white transition-colors hover:bg-purple-700 cursor-pointer"
      >
        Sair
      </button>
    </main>
  );
}

export default Profile;

export default function HomePage() {
  const token = localStorage.getItem('jwtToken');

  const handleLogout = () => {
    localStorage.removeItem('jwtToken');
    window.location.href = '/auth'; 
  };

  return (
    <div className="p-10">
      <h1 className="text-4xl font-bold">Bem-vindo à Página Principal!</h1>
      <p className="mt-4">Login realizado com sucesso.</p>
      <div className="mt-6 p-4 bg-gray-100 rounded break-words">
        <h2 className="font-bold">Seu Token JWT:</h2>
        <p>{token}</p>
      </div>
      <button
        onClick={handleLogout}
        className="mt-8 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
      >
        Logout
      </button>
    </div>
  );
}

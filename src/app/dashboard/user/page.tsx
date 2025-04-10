"use client";

import { useEffect, useState } from "react";
import {
  getUsers,
  deleteUser,
  updateUser,
  createUser,
} from "../../services/dashboardService";
import { User } from "../../interfaces/user.interface";
import Link from "next/link";

export default function DashboardUser() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [newPassword, setNewPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    const loadUsers = async () => {
      try {
        const data = await getUsers();
        // Asegurarse de que data sea un arreglo
        if (Array.isArray(data)) {
          setUsers(data);
        } else {
          console.error("Los datos no son un arreglo:", data);
          setUsers([]);
        }
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };
    loadUsers();
  }, []);

  //handle delete
  const handleDelete = async (id: number) => {
    const currentUserId = 1; // Reemplaza esto con el ID del usuario autenticado
  
    if (id === currentUserId) {
      alert("No puedes eliminarte a ti mismo.");
      return;
    }
  
    const isConfirmed = window.confirm("¿Estás seguro de que deseas eliminar este usuario?");
    if (!isConfirmed) return;
  
    try {
      await deleteUser(id);
      setUsers(users.filter((user) => user.id !== id));
    } catch (error) {
      alert("Error al eliminar el usuario");
    }
  };

  //handle edit
  const handleEdit = (user: User) => {
    setEditingUser(user);
    setIsModalOpen(true);
  };

  //handle create
  const handleCreate = () => {
    setEditingUser(null);
    setIsModalOpen(true);
  };

  //handle Submit
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const userData: Partial<User> = Object.fromEntries(formData.entries());
  
    try {
      if (editingUser) {
        await updateUser(editingUser.id, userData);
      } else {
        await createUser(userData);
      }
      
      // Recargar la lista de usuarios desde la API
      const updatedUsers = await getUsers();
      setUsers(updatedUsers);
  
      setIsModalOpen(false);
    } catch (err) {
      console.error("Error al guardar usuario", err);
    }
  };


  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditingUser((prevUser) => {
      if (prevUser) {
        return { ...prevUser, [name]: value }; // Actualiza el campo que cambió
      }
      return prevUser; // Si no hay usuario para editar, no hace nada
    });
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setNewPassword(value);
  };


  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  return (
    <div className="relative p-20">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-30 mb-6">
        <div className="bg-[url(/fondo-inverted.png)] rounded-lg shadow-md">
          <div className="bg-black/60 dark:bg-black text-white backdrop-blur-sm p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold mb-2">Total de Usuarios</h3>
            <div className="flex items-center gap-2">
              <img src="/user-white.png" alt="users" className="w-10" />
              <p className="text-3xl font-bold">{users.length}</p>
            </div>
          </div>
        </div>
        <div className="bg-[url(/fondo-inverted.png)] rounded-lg shadow-md">
          <div className="bg-black/60 dark:bg-black text-white backdrop-blur-sm p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold mb-2">
              Profesores Conectados
            </h3>
            <div className="flex items-center gap-2">
              <img src="/user-white.png" alt="users" className="w-10" />
              <p className="text-3xl font-bold">31</p>
            </div>
          </div>
        </div>
        <div className="bg-[url(/fondo-inverted.png)]  rounded-lg shadow-md">
          <div className="bg-black/60 dark:bg-black text-white backdrop-blur-sm p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold mb-2">Alumnos Conectados</h3>
            <div className="flex items-center gap-2">
              <img src="/user-white.png" alt="users" className="w-10" />
              <p className="text-3xl font-bold">33</p>
            </div>
          </div>
        </div>
      </div>

      <div className="relative">
        <button
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          className="text-white bg-black hover:bg-gray-800 focus:ring-4 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center"
          type="button"
        >
          Filtros
          <svg
            className="w-2.5 h-2.5 ms-3"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 10 6"
          >
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="m1 1 4 4 4-4"
            />
          </svg>
        </button>

        <button
          onClick={handleCreate}
          className="text-white bg-green-600 hover:bg-green-700 font-medium rounded-lg text-sm px-5 py-2.5 ml-2"
        >
          Crear Usuario
        </button>

        {isDropdownOpen && (
          <div className="absolute z-20 bg-white divide-y divide-gray-100 rounded-lg shadow-sm w-72 dark:bg-gray-700 dark:divide-gray-600 mt-2">
            <ul className="p-3 space-y-1 text-sm text-gray-700 dark:text-gray-200">
              {[
                "A-Z",
                "Z-A",
                "Alumnos",
                "Profesores",
                "Conectados",
                "Inactivos",
              ].map((option, index) => (
                <li key={index}>
                  <div className="flex p-2 rounded-sm hover:bg-gray-100 dark:hover:bg-gray-600">
                    <label className="inline-flex items-center w-full cursor-pointer">
                      <input
                        type="checkbox"
                        value=""
                        className="sr-only peer"
                      />
                      <div className="relative w-9 h-5 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue dark:peer-focus:ring-gray-800 rounded-full peer dark:bg-gray-600 peer-checked:after:translate-x-full rtl:peer-checked:after:translate-x-[-100%] peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all dark:border-gray-500 peer-checked:bg-black dark:peer-checked:bg-black"></div>
                      <span className="ms-3 text-sm font-medium text-gray-900 dark:text-gray-300">
                        {option}
                      </span>
                    </label>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      <div className="bg-[url(/fondo-inverted.png)] dark:bg-black bg-cover h-[50vh] rounded-lg shadow-md overflow-x-auto mt-4">
        <div className="bg-black/70 h-auto dark:bg-black text-white backdrop-blur-sm p-6  ">
          <h3 className="text-lg font-semibold mb-4">Usuarios</h3>
          {loading ? (
            <p>Cargando usuarios...</p>
          ) : error ? (
            <p className="text-red-500">{error}</p>
          ) : (
            <table className="w-full h-[calc(45vh-120px)] border-collapse ">
              <thead>
                <tr className="bg-gray-800 text-white">
                  <th className="p-3 text-left">ID</th>
                  <th className="p-3 text-left">Nombre de usuario</th>
                  <th className="p-3 text-left">Email</th>
                  <th className="p-3 text-left">Rol</th>
                  <th className="p-3 text-left">Estatus ID</th>
                  <th className="p-3 text-left">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id} className="border-b hover:bg-black">
                    <td className="p-3">{user.id}</td>
                    <td className="p-3">
                      <Link
                        href={`/dashboard/user-info/${user.username}`}
                        className="text-white hover:underline"
                      >
                        {user.username}
                      </Link>
                    </td>
                    <td className="p-3">{user.email}</td>
                    <td className="p-3">{user.roles_id}</td>
                    <td className="p-3">{user.statuses_id}</td>
                    <td className="p-3 flex gap-2">
                      <button
                        onClick={() => handleEdit(user)}
                        className="bg-yellow-500 text-black px-3 py-1 rounded hover:bg-yellow-600"
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => handleDelete(user.id)}
                        className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                      >
                        Eliminar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
      {/*MODAL*/}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50">
          <div className="w-full max-w-2xl border-none shadow-xl bg-gradient-to-b from-white to-slate-50 dark:from-slate-900 dark:to-slate-950 rounded-lg">
            <div className="relative text-black rounded-t-lg p-6">
              <div className="absolute top-3 right-3">
                <button
                  className="text-white hover:bg-white/20 rounded-full p-1"
                  onClick={() => setIsModalOpen(false)}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
                    <path d="M18 6 6 18"></path>
                    <path d="m6 6 12 12"></path>
                  </svg>
                </button>
              </div>
              <div className="flex items-center gap-3">
                <h2 className="text-2xl font-bold">
                  {editingUser ? "Editar Usuario" : "Crear Usuario"}
                </h2>
              </div>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="p-6 grid gap-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label htmlFor="username" className="text-sm font-medium">Nombre de Usuario</label>
                    <input
                      id="username"
                      name="username"
                      defaultValue={editingUser?.username ?? ""}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="email" className="text-sm font-medium">Email</label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      defaultValue={editingUser?.email ?? ""}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="first_name" className="text-sm font-medium">Nombre</label>
                    <input
                      id="first_name"
                      name="first_name"
                      defaultValue={editingUser?.first_name ?? ""}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="last_name" className="text-sm font-medium">Apellido</label>
                    <input
                      id="last_name"
                      name="last_name"
                      defaultValue={editingUser?.last_name ?? ""}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="roles_id" className="text-sm font-medium">Rol ID</label>
                    <input
                      id="roles_id"
                      name="roles_id"
                      type="number"
                      defaultValue={editingUser?.roles_id?.toString() ?? ""}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="statuses_id" className="text-sm font-medium">Estatus ID</label>
                    <input
                      id="statuses_id"
                      name="statuses_id"
                      type="number"
                      defaultValue={editingUser?.statuses_id?.toString() ?? ""}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                  <div className="space-y-2 col-span-full">
                    <label htmlFor="password" className="text-sm font-medium">Contraseña</label>
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      value={newPassword}
                      onChange={handlePasswordChange}
                      className="w-full mt-1 p-2 border rounded-lg focus:ring-2 focus:ring-blue-400"
                      required={!editingUser}
                    />
                  </div>
                </div>
              </div>
              <div className="flex justify-center gap-4 p-6 pt-0">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="min-w-[120px] px-4 py-2 border border-gray-300 rounded-md hover:bg-red-400 bg-red-500"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="min-w-[120px] px-4 py-2 border border-gray-300 rounded-md hover:bg-blue-400 flex items-center justify-center bg-blue-500"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2 h-4 w-4">
                    <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path>
                    <polyline points="17 21 17 13 7 13 7 21"></polyline>
                    <polyline points="7 3 7 8 15 8"></polyline>
                  </svg>
                  Guardar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

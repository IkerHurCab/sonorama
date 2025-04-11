"use client";
import { User } from "../interfaces/user.interface";
import { Article } from "../interfaces/article.interface"
const API_URL = "http://127.0.0.1:8000/api/users";
const ARTICLES_API_URL = "http://127.0.0.1:8000/api/articles"

//get users
export async function getUsers(): Promise<User[]> {
    let token: string = "";
    if (typeof window !== "undefined") {
        token = localStorage.getItem("token") || "";
    }
    try {
        const response = await fetch(API_URL, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json",
                "Authorization": `Bearer ${token}`, 
            },
        });

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(errorText);
        }

        return await response.json();
    } catch (error) {
        console.error("Error al obtener los usuarios: ", error);
        throw error;
    }
}


//create user
export async function createUser(userData: Partial<User>): Promise<User>{
    let token: string = "";
    if (typeof window !== "undefined") {
        token = localStorage.getItem("token") || "";
    }
    try{
        const response = await fetch (API_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json",
                "Authorization": `Bearer ${token}`,
            },
            body: JSON.stringify(userData),
        });
        if (!response.ok) throw new Error("Error al crear el usuario");

        return await response.json();
    }catch(err){
        console.error("Error al crear usuario: ", err);
        throw err
    }
}

//update user by id
export async function updateUser(id: number, userData: Partial<User>): Promise<User> {
    let token: string = "";
    if (typeof window !== "undefined") {
        token = localStorage.getItem("token") || "";
    }
    try {
        const response = await fetch(`${API_URL}/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json",
                "Authorization": `Bearer ${token}`,
            },
            body: JSON.stringify(userData),
        });

        if (!response.ok) throw new Error("Error al actualizar el usuario");

        return await response.json();
    } catch (error) {
        console.error("Error al actualizar el usuario: ", error);
        throw error;
    }
}

//delete user by id
export async function deleteUser(id: number): Promise<{ message: string }> {
    let token: string = "";
    if (typeof window !== "undefined") {
        token = localStorage.getItem("token") || "";
    }
    try {
        const response = await fetch(`${API_URL}/${id}`, {
            method: "DELETE",
            headers: {
                "Authorization": `Bearer ${token}`,
            },
        });

        if (!response.ok) throw new Error("Error al eliminar el usuario");

        return await response.json();
    } catch (error) {
        console.error("Error al eliminar el usuario: ", error);
        throw error;
    }
}

export async function getArticles(): Promise<Article[]> {
    try {
      const token: string | null = localStorage.getItem("token")
      const response = await fetch(ARTICLES_API_URL, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      })
  
      if (!response.ok) throw new Error("Error al obtener los artículos")
  
      return await response.json()
    } catch (error) {
      console.error("Error al obtener los artículos: ", error)
      throw error
    }
  }
  
  // Obtener un artículo específico por ID
  export async function getArticleById(id: number): Promise<Article> {
    try {
      const token: string | null = localStorage.getItem("token")
      const response = await fetch(`${ARTICLES_API_URL}/${id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      })
  
      if (!response.ok) throw new Error("Error al obtener el artículo")
  
      return await response.json()
    } catch (error) {
      console.error("Error al obtener el artículo: ", error)
      throw error
    }
  }
  
  // Validar o rechazar un artículo
  export async function validateArticle(id: number, validated: boolean): Promise<Article> {
    try {
      const token: string | null = localStorage.getItem("token")
      const response = await fetch(`${ARTICLES_API_URL}/${id}/validate`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ validated }),
      })
  
      if (!response.ok) throw new Error("Error al validar el artículo")
  
      return await response.json()
    } catch (error) {
      console.error("Error al validar el artículo: ", error)
      throw error
    }
  }
  
  // Eliminar un artículo
  export async function deleteArticle(id: number): Promise<{ message: string }> {
    try {
      const token: string | null = localStorage.getItem("token")
      const response = await fetch(`${ARTICLES_API_URL}/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
  
      if (!response.ok) throw new Error("Error al eliminar el artículo")
  
      return await response.json()
    } catch (error) {
      console.error("Error al eliminar el artículo: ", error)
      throw error
    }
  }

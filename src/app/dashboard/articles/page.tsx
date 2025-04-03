"use client"

import { useEffect, useState } from "react"
import { Check, Eye, X } from "lucide-react"
import { getArticles, getArticleById, validateArticle, deleteArticle } from "../../services/dashboardService"
import type { Article, ArticleTemplate } from "../../interfaces/article.interface"

export default function DashboardArticles() {
  const [articles, setArticles] = useState<Article[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null)
  const [articleTemplates, setArticleTemplates] = useState<ArticleTemplate[]>([])

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const data = await getArticles()
        setArticles(data)
      } catch (err) {
        setError((err as Error).message)
      } finally {
        setLoading(false)
      }
    }

    fetchArticles()
  }, [])

  const handleViewArticle = async (article: Article) => {
    setSelectedArticle(article)

    try {
      const data = await getArticleById(article.id)
      setArticleTemplates(((data as Article & { templates?: ArticleTemplate[] }).templates) || [])
      setIsModalOpen(true)
    } catch (err) {
      console.error("Error al cargar los detalles del artículo:", err)
    }
  }

  const handleValidateArticle = async (id: number, validate: boolean) => {
    const action = validate ? "aprobar" : "rechazar"
    const isConfirmed = window.confirm(`¿Estás seguro de que deseas ${action} este artículo?`)

    if (!isConfirmed) return

    try {
      await validateArticle(id, validate)

      setArticles(articles.map((article) => (article.id === id ? { ...article, validated: validate } : article)))

      alert(`Artículo ${action}do correctamente`)
    } catch (err) {
      console.error(`Error al ${action} el artículo:`, err)
      alert(`Error al ${action} el artículo`)
    }
  }

  const handleDeleteArticle = async (id: number) => {
    const isConfirmed = window.confirm("¿Estás seguro de que deseas eliminar este artículo?")

    if (!isConfirmed) return

    try {
      await deleteArticle(id)

      setArticles(articles.filter((article) => article.id !== id))
      alert("Artículo eliminado correctamente")
    } catch (err) {
      console.error("Error al eliminar el artículo:", err)
      alert("Error al eliminar el artículo")
    }
  }

  const pendingArticles = articles.filter((article) => !article.validated).length
  const validatedArticles = articles.filter((article) => article.validated).length

  return (
    <div className="relative p-20">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-30 mb-6">
        <div className="bg-[url(/fondo-inverted.png)] rounded-lg shadow-md">
          <div className="bg-black/60 dark:bg-black text-white backdrop-blur-sm p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold mb-2">Total de Artículos</h3>
            <div className="flex items-center gap-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="w-10 h-10"
              >
                <path d="M4 22h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v16a2 2 0 0 1-2 2Zm0 0a2 2 0 0 1-2-2v-9c0-1.1.9-2 2-2h2"></path>
                <path d="M18 14h-8"></path>
                <path d="M15 18h-5"></path>
                <path d="M10 6h8v4h-8V6Z"></path>
              </svg>
              <p className="text-3xl font-bold">{articles.length}</p>
            </div>
          </div>
        </div>
        <div className="bg-[url(/fondo-inverted.png)] rounded-lg shadow-md">
          <div className="bg-black/60 dark:bg-black text-white backdrop-blur-sm p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold mb-2">Artículos Validados</h3>
            <div className="flex items-center gap-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="w-10 h-10"
              >
                <path d="M8 3H7a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2h-1"></path>
                <path d="M12 17v.01"></path>
                <path d="M12 14a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Z"></path>
                <path d="M15 3h-6a2 2 0 0 0-2 2v0a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2v0a2 2 0 0 0-2-2Z"></path>
                <path d="m9 14 6-6"></path>
              </svg>
              <p className="text-3xl font-bold">{validatedArticles}</p>
            </div>
          </div>
        </div>
        <div className="bg-[url(/fondo-inverted.png)] rounded-lg shadow-md">
          <div className="bg-black/60 dark:bg-black text-white backdrop-blur-sm p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold mb-2">Pendientes de Validación</h3>
            <div className="flex items-center gap-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="w-10 h-10"
              >
                <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"></path>
                <polyline points="14 2 14 8 20 8"></polyline>
                <path d="M12 18v-6"></path>
                <path d="M8 15h8"></path>
              </svg>
              <p className="text-3xl font-bold">{pendingArticles}</p>
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
            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 4 4 4-4" />
          </svg>
        </button>

        {isDropdownOpen && (
          <div className="absolute z-20 bg-white divide-y divide-gray-100 rounded-lg shadow-sm w-72 dark:bg-gray-700 dark:divide-gray-600 mt-2">
            <ul className="p-3 space-y-1 text-sm text-gray-700 dark:text-gray-200">
              {["Más recientes", "Más antiguos", "Pendientes", "Validados", "A-Z", "Z-A"].map((option, index) => (
                <li key={index}>
                  <div className="flex p-2 rounded-sm hover:bg-gray-100 dark:hover:bg-gray-600">
                    <label className="inline-flex items-center w-full cursor-pointer">
                      <input type="checkbox" value="" className="sr-only peer" />
                      <div className="relative w-9 h-5 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue dark:peer-focus:ring-gray-800 rounded-full peer dark:bg-gray-600 peer-checked:after:translate-x-full rtl:peer-checked:after:translate-x-[-100%] peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all dark:border-gray-500 peer-checked:bg-black dark:peer-checked:bg-black"></div>
                      <span className="ms-3 text-sm font-medium text-gray-900 dark:text-gray-300">{option}</span>
                    </label>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      <div className="bg-[url(/fondo-inverted.png)] dark:bg-black bg-cover h-[50vh] rounded-lg shadow-md overflow-x-auto mt-4">
        <div className="bg-black/70 h-auto dark:bg-black text-white backdrop-blur-sm p-6">
          <h3 className="text-lg font-semibold mb-4">Artículos</h3>
          {loading ? (
            <p>Cargando artículos...</p>
          ) : error ? (
            <p className="text-red-500">{error}</p>
          ) : (
            <table className="w-full h-[calc(45vh-120px)] border-collapse">
              <thead>
                <tr className="bg-gray-800 text-white">
                  <th className="p-3 text-left">ID</th>
                  <th className="p-3 text-left">Título</th>
                  <th className="p-3 text-left">Autor</th>
                  <th className="p-3 text-left">Centro</th>
                  <th className="p-3 text-left">Estado</th>
                  <th className="p-3 text-left">Fecha</th>
                  <th className="p-3 text-left">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {articles.map((article) => (
                  <tr key={article.id} className="border-b hover:bg-black">
                    <td className="p-3">{article.id}</td>
                    <td className="p-3">
                      <span
                        className="text-white hover:underline cursor-pointer"
                        onClick={() => handleViewArticle(article)}
                      >
                        {article.titulo}
                      </span>
                    </td>
                    <td className="p-3">{`${article.nombre_autor} ${article.apellidos_autor}`}</td>
                    <td className="p-3">{article.centro}</td>
                    <td className="p-3">
                      <span
                        className={`px-2 py-1 rounded-full text-xs ${article.validated ? "bg-green-500" : "bg-yellow-500"}`}
                      >
                        {article.validated ? "Validado" : "Pendiente"}
                      </span>
                    </td>
                    <td className="p-3">{new Date(article.created_at).toLocaleDateString()}</td>
                    <td className="p-3 flex gap-2">
                      <button
                        onClick={() => handleViewArticle(article)}
                        className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 flex items-center"
                      >
                        <Eye className="w-4 h-4 mr-1" /> Ver
                      </button>
                      {!article.validated && (
                        <button
                          onClick={() => handleValidateArticle(article.id, true)}
                          className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600 flex items-center"
                        >
                          <Check className="w-4 h-4 mr-1" /> Aprobar
                        </button>
                      )}
                      {!article.validated && (
                        <button
                          onClick={() => handleValidateArticle(article.id, false)}
                          className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 flex items-center"
                        >
                          <X className="w-4 h-4 mr-1" /> Rechazar
                        </button>
                      )}
                      <button
                        onClick={() => handleDeleteArticle(article.id)}
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

      {isModalOpen && selectedArticle && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50">
          <div className="w-full max-w-4xl border-none shadow-xl bg-gradient-to-b from-white to-slate-50 dark:from-slate-900 dark:to-slate-950 rounded-lg max-h-[90vh] overflow-y-auto">
            <div className="relative text-black dark:text-white rounded-t-lg p-6">
              <div className="absolute top-3 right-3">
                <button
                  className="text-black dark:text-white hover:bg-white/20 rounded-full p-1"
                  onClick={() => setIsModalOpen(false)}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-5 w-5"
                  >
                    <path d="M18 6 6 18"></path>
                    <path d="m6 6 12 12"></path>
                  </svg>
                </button>
              </div>
              <div className="flex items-center gap-3">
                <h2 className="text-2xl font-bold">{selectedArticle.titulo}</h2>
              </div>
            </div>
            <div className="p-6 grid gap-6 text-black dark:text-white">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <h3 className="font-semibold">Información del Artículo</h3>
                  <p>
                    <span className="font-medium">Autor:</span> {selectedArticle.nombre_autor}{" "}
                    {selectedArticle.apellidos_autor}
                  </p>
                  <p>
                    <span className="font-medium">Centro:</span> {selectedArticle.centro}
                  </p>
                  <p>
                    <span className="font-medium">Estado:</span> {selectedArticle.validated ? "Validado" : "Pendiente"}
                  </p>
                  <p>
                    <span className="font-medium">Fecha de creación:</span>{" "}
                    {new Date(selectedArticle.created_at).toLocaleDateString()}
                  </p>
                </div>
                <div className="space-y-2">
                  <h3 className="font-semibold">Ubicación</h3>
                  <p>
                    <span className="font-medium">Latitud:</span> {selectedArticle.latitud}
                  </p>
                  <p>
                    <span className="font-medium">Longitud:</span> {selectedArticle.longitud}
                  </p>
                  <h3 className="font-semibold mt-4">Bibliografía</h3>
                  <p className="text-sm">{selectedArticle.bibliografia}</p>
                </div>
              </div>

              {articleTemplates.length > 0 && (
                <div className="mt-4">
                  <h3 className="font-semibold text-lg mb-3">Contenido del Artículo</h3>
                  <div className="space-y-6">
                    {articleTemplates
                      .sort((a, b) => a.orden - b.orden)
                      .map((template, index) => (
                        <div key={template.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                          <h4 className="font-medium mb-2">
                            Sección {index + 1} - {template.tipo}
                          </h4>

                          {template.textArea1 && <p className="mb-2">{template.textArea1}</p>}
                          {template.textArea2 && <p className="mb-2">{template.textArea2}</p>}
                          {template.textArea3 && <p className="mb-2">{template.textArea3}</p>}
                          {template.textArea4 && <p className="mb-2">{template.textArea4}</p>}

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
                            {template.imageUrl1 && (
                              <div>
                                <img
                                  src={template.imageUrl1 || "/placeholder.svg"}
                                  alt="Imagen 1"
                                  className="w-full h-auto rounded-lg"
                                />
                                {template.imageFooter1 && (
                                  <p className="text-xs mt-1 text-gray-600 dark:text-gray-400">
                                    {template.imageFooter1}
                                  </p>
                                )}
                              </div>
                            )}
                            {template.imageUrl2 && (
                              <div>
                                <img
                                  src={template.imageUrl2 || "/placeholder.svg"}
                                  alt="Imagen 2"
                                  className="w-full h-auto rounded-lg"
                                />
                                {template.imageFooter2 && (
                                  <p className="text-xs mt-1 text-gray-600 dark:text-gray-400">
                                    {template.imageFooter2}
                                  </p>
                                )}
                              </div>
                            )}
                            {template.imageUrl3 && (
                              <div>
                                <img
                                  src={template.imageUrl3 || "/placeholder.svg"}
                                  alt="Imagen 3"
                                  className="w-full h-auto rounded-lg"
                                />
                                {template.imageFooter3 && (
                                  <p className="text-xs mt-1 text-gray-600 dark:text-gray-400">
                                    {template.imageFooter3}
                                  </p>
                                )}
                              </div>
                            )}
                            {template.imageUrl4 && (
                              <div>
                                <img
                                  src={template.imageUrl4 || "/placeholder.svg"}
                                  alt="Imagen 4"
                                  className="w-full h-auto rounded-lg"
                                />
                                {template.imageFooter4 && (
                                  <p className="text-xs mt-1 text-gray-600 dark:text-gray-400">
                                    {template.imageFooter4}
                                  </p>
                                )}
                              </div>
                            )}
                          </div>

                          {template.shortCitation && (
                            <blockquote className="border-l-4 border-gray-300 dark:border-gray-600 pl-4 italic my-4">
                              {template.shortCitation}
                            </blockquote>
                          )}
                        </div>
                      ))}
                  </div>
                </div>
              )}
            </div>
            <div className="flex justify-center gap-4 p-6 pt-0">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="min-w-[120px] px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700 bg-gray-100 dark:bg-gray-800 text-black dark:text-white"
              >
                Cerrar
              </button>
              {!selectedArticle.validated && (
                <>
                  <button
                    onClick={() => {
                      handleValidateArticle(selectedArticle.id, true)
                      setIsModalOpen(false)
                    }}
                    className="min-w-[120px] px-4 py-2 border border-gray-300 rounded-md hover:bg-green-600 bg-green-500 text-white flex items-center justify-center"
                  >
                    <Check className="mr-2 h-4 w-4" />
                    Aprobar
                  </button>
                  <button
                    onClick={() => {
                      handleValidateArticle(selectedArticle.id, false)
                      setIsModalOpen(false)
                    }}
                    className="min-w-[120px] px-4 py-2 border border-gray-300 rounded-md hover:bg-red-600 bg-red-500 text-white flex items-center justify-center"
                  >
                    <X className="mr-2 h-4 w-4" />
                    Rechazar
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}


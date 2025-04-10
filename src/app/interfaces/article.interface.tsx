export interface Article {
    id: number
    created_at: string
    updated_at: string
    titulo: string
    nombre_autor: string
    apellidos_autor: string
    id_autor: number
    validated: boolean
    centro: string
    latitud: string
    longitud: string
    bibliografia: string
  }
  
  export interface ArticleTemplate {
    id: number
    created_at: string
    updated_at: string
    tipo: string
    orden: number
    textArea1: string | null
    textArea2: string | null
    textArea3: string | null
    textArea4: string | null
    imageUrl1: string | null
    imageUrl2: string | null
    imageUrl3: string | null
    imageUrl4: string | null
    imageFooter1: string | null
    imageFooter2: string | null
    imageFooter3: string | null
    imageFooter4: string | null
    shortCitation: string | null
    article_id: number
  }
  
  
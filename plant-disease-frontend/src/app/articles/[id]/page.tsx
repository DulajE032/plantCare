"use client"

import { use, useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { getArticleById, deleteArticle, getProfile } from "@/lib/api"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowLeft, User, Calendar, Tag, Trash2 } from "lucide-react"

interface ArticleDetailPageProps {
  params: Promise<{ id: string }>
}

export default function ArticleDetailPage({ params }: ArticleDetailPageProps) {
  const router = useRouter()
  const resolvedParams = use(params)
  const [article, setArticle] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [profile, setProfile] = useState<any>(null)

  useEffect(() => {
    async function loadArticle() {
      try {
        const data = await getArticleById(resolvedParams.id)
        setArticle(data)

        const userProfile = await getProfile().catch(() => null)
        setProfile(userProfile)
      } catch (err) {
        console.error("Failed to load article:", err)
      } finally {
        setLoading(false)
      }
    }
    loadArticle()
  }, [resolvedParams.id])

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this article?")) return
    try {
      await deleteArticle(resolvedParams.id)
      router.push("/articles")
      router.refresh()
    } catch (err: any) {
      alert(`Failed to delete article: ${err.message}`)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600" />
      </div>
    )
  }

  if (!article) {
    return (
      <div className="text-center py-20 space-y-4">
        <p className="text-zinc-500">Article not found.</p>
        <Link href="/articles">
          <Button>Back to Articles</Button>
        </Link>
      </div>
    )
  }

  const isAuthorAllowed = profile && (profile.role === "admin" || profile.role === "expert")

  return (
    <div className="space-y-6 py-4 max-w-3xl mx-auto">
      <div className="flex items-center justify-between">
        <Link href="/articles" className="flex items-center gap-2 text-zinc-600 hover:text-zinc-900 dark:text-zinc-455">
          <Button variant="ghost" size="icon" className="rounded-xl">
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <span className="font-semibold text-sm">Back to Articles</span>
        </Link>

        {isAuthorAllowed && (
          <Button variant="ghost" size="icon" className="text-zinc-400 hover:text-red-500 rounded-xl" onClick={handleDelete}>
            <Trash2 className="h-5 w-5" />
          </Button>
        )}
      </div>

      <Card className="border border-zinc-100 dark:border-zinc-800 shadow-md rounded-2xl overflow-hidden bg-white dark:bg-zinc-900/50">
        <CardContent className="p-8 space-y-6">
          <div className="space-y-4">
            <div className="flex flex-wrap gap-2">
              {article.tags.map((tag: string) => (
                <span key={tag} className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-green-50 text-green-700 dark:bg-green-950/20 dark:text-green-455 flex items-center gap-1">
                  <Tag className="h-3 w-3" />
                  <span>{tag}</span>
                </span>
              ))}
            </div>

            <h1 className="text-3xl font-black text-zinc-950 dark:text-zinc-50 leading-tight">
              {article.title}
            </h1>

            <div className="flex items-center gap-4 text-xs text-zinc-400 font-semibold border-b border-zinc-50 dark:border-zinc-850 pb-4">
              <span className="flex items-center gap-1">
                <User className="h-4 w-4 text-green-600" />
                <span>Published by {article.author}</span>
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                <span>{new Date(article.created_at).toLocaleDateString()}</span>
              </span>
            </div>
          </div>

          <div className="text-zinc-700 dark:text-zinc-300 leading-relaxed text-base whitespace-pre-wrap space-y-4">
            {article.content}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

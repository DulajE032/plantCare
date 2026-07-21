"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { getArticles, getProfile, createArticle } from "@/lib/api"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { BookOpen, Calendar, User, Plus, FileText, AlertCircle, ArrowRight } from "lucide-react"

export default function ArticlesPage() {
  const [articles, setArticles] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [profile, setProfile] = useState<any>(null)
  
  // Create Form State
  const [showForm, setShowForm] = useState(false)
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [author, setAuthor] = useState("")
  const [tags, setTags] = useState("")
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function loadData() {
      try {
        const articleList = await getArticles()
        setArticles(articleList)

        const userProfile = await getProfile().catch(() => null)
        setProfile(userProfile)
        if (userProfile) {
          setAuthor(userProfile.full_name)
        }
      } catch (err) {
        console.error("Failed to load articles:", err)
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    try {
      const tagList = tags.split(",").map(t => t.trim()).filter(Boolean)
      const newArticle = await createArticle(title, content, author, tagList)
      setArticles([newArticle, ...articles])
      
      // Clear form
      setTitle("")
      setContent("")
      setTags("")
      setShowForm(false)
    } catch (err: any) {
      setError(err.message || "Failed to publish article")
    }
  }

  const isAuthorAllowed = profile && (profile.role === "admin" || profile.role === "expert")

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600" />
      </div>
    )
  }

  return (
    <div className="space-y-8 py-4 max-w-4xl mx-auto">
      <div className="flex justify-between items-end">
        <div className="space-y-2">
          <h1 className="text-3xl font-extrabold text-zinc-950 dark:text-zinc-50 flex items-center gap-2">
            <BookOpen className="h-7 w-7 text-green-600 dark:text-green-400" />
            <span>Articles & Guides</span>
          </h1>
          <p className="text-zinc-500 dark:text-zinc-400 text-sm sm:text-base">
            Expert agricultural guides on disease control, prevention, and crop management.
          </p>
        </div>

        {isAuthorAllowed && !showForm && (
          <Button 
            onClick={() => setShowForm(true)}
            className="bg-green-600 hover:bg-green-700 text-white rounded-xl flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            <span>Write Article</span>
          </Button>
        )}
      </div>

      {showForm && (
        <Card className="border border-zinc-150 dark:border-zinc-800 p-6 bg-white dark:bg-zinc-900/50 shadow-md rounded-2xl space-y-6">
          <h2 className="font-bold text-lg text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
            <FileText className="h-5 w-5 text-green-600" />
            <span>Write Agricultural Guide</span>
          </h2>

          {error && (
            <div className="flex gap-2 p-3 bg-red-50 border border-red-200 dark:bg-red-950/20 dark:border-red-900/30 rounded-xl text-red-800 dark:text-red-400 text-sm">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-zinc-500 uppercase mb-1">Article Title</label>
              <Input placeholder="e.g. Managing Potato Late Blight in Wet Seasons" value={title} onChange={(e) => setTitle(e.target.value)} required />
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-500 uppercase mb-1">Author Name</label>
              <Input placeholder="e.g. Dr. Jane Doe" value={author} onChange={(e) => setAuthor(e.target.value)} required />
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-500 uppercase mb-1">Tags (Comma-separated)</label>
              <Input placeholder="e.g. potato, blight, organic" value={tags} onChange={(e) => setTags(e.target.value)} />
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-500 uppercase mb-1">Content</label>
              <textarea 
                className="w-full border border-zinc-200 dark:border-zinc-800 rounded-xl bg-white dark:bg-zinc-950 p-3 text-sm h-48 focus:outline-none focus:ring-1 focus:ring-green-500"
                placeholder="Write your article content here..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                required
              />
            </div>

            <div className="flex gap-3 justify-end">
              <Button type="button" variant="outline" className="rounded-xl border-zinc-200 dark:border-zinc-800" onClick={() => setShowForm(false)}>
                Cancel
              </Button>
              <Button type="submit" className="bg-green-600 hover:bg-green-700 text-white rounded-xl font-semibold">
                Publish Guide
              </Button>
            </div>
          </form>
        </Card>
      )}

      {articles.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {articles.map((article) => (
            <Link key={article.id} href={`/articles/${article.id}`}>
              <Card className="hover:shadow-md transition-all border border-zinc-100 dark:border-zinc-800 rounded-2xl overflow-hidden bg-white dark:bg-zinc-900/50 flex flex-col justify-between h-56">
                <CardContent className="p-6 space-y-4">
                  <div className="flex gap-2">
                    {article.tags.map((tag: string) => (
                      <span key={tag} className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-green-50 text-green-700 dark:bg-green-950/20 dark:text-green-400">
                        {tag}
                      </span>
                    ))}
                  </div>

                  <div className="space-y-1">
                    <h2 className="font-extrabold text-lg text-zinc-900 dark:text-zinc-50 line-clamp-2 leading-snug">
                      {article.title}
                    </h2>
                    <p className="text-zinc-500 dark:text-zinc-400 text-xs line-clamp-3 leading-relaxed">
                      {article.content}
                    </p>
                  </div>
                </CardContent>
                <div className="px-6 py-4 bg-zinc-50/50 dark:bg-zinc-950/20 border-t border-zinc-100 dark:border-zinc-850 flex items-center justify-between text-xs text-zinc-400 font-medium">
                  <span className="flex items-center gap-1">
                    <User className="h-3.5 w-3.5" />
                    {article.author}
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar className="h-3.5 w-3.5" />
                    {new Date(article.created_at).toLocaleDateString()}
                  </span>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      ) : (
        <Card className="border border-zinc-100 dark:border-zinc-800 p-12 text-center bg-white dark:bg-zinc-900/50 rounded-2xl">
          <p className="text-zinc-500 text-sm">No articles or guides published yet.</p>
        </Card>
      )}
    </div>
  )
}

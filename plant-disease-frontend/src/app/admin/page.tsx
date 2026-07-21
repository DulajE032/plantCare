"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { getProfile, getAdminUsers, getAdminReports, adminCreateDisease, adminDeleteDisease } from "@/lib/api"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Shield, Users, BarChart3, Plus, Trash2, Edit2, AlertCircle } from "lucide-react"

export default function AdminPage() {
  const router = useRouter()
  const [profile, setProfile] = useState<any>(null)
  const [users, setUsers] = useState<any[]>([])
  const [reports, setReports] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  
  // Disease form state
  const [diseaseId, setDiseaseId] = useState("")
  const [slug, setSlug] = useState("")
  const [diseaseName, setDiseaseName] = useState("")
  const [severity, setSeverity] = useState("moderate")
  const [description, setDescription] = useState("")
  const [causes, setCauses] = useState("")
  const [treatment, setTreatment] = useState("")
  const [prevention, setPrevention] = useState("")
  const [cropType, setCropType] = useState("")
  const [statusMessage, setStatusMessage] = useState<string | null>(null)

  useEffect(() => {
    async function loadAdminData() {
      try {
        const userProfile = await getProfile()
        if (userProfile.role !== "admin") {
          router.push("/profile")
          return
        }
        setProfile(userProfile)

        const adminUsers = await getAdminUsers()
        setUsers(adminUsers)

        const adminReports = await getAdminReports()
        setReports(adminReports)
      } catch (err) {
        console.error("Failed to load admin data:", err)
        router.push("/login")
      } finally {
        setLoading(false)
      }
    }
    loadAdminData()
  }, [router])

  const handleDiseaseSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatusMessage(null)

    try {
      const diseaseData = {
        id: diseaseId || slug,
        slug,
        disease: diseaseName,
        severity,
        description,
        causes: causes.split("\n").filter(c => c.trim()),
        treatment: treatment.split("\n").filter(t => t.trim()),
        prevention: prevention.split("\n").filter(p => p.trim()),
        cropType
      }
      await adminCreateDisease(diseaseData)
      setStatusMessage("Disease record successfully created/updated!")
      
      // Clear form
      setDiseaseId("")
      setSlug("")
      setDiseaseName("")
      setSeverity("moderate")
      setDescription("")
      setCauses("")
      setTreatment("")
      setPrevention("")
      setCropType("")
    } catch (err: any) {
      setStatusMessage(`Error: ${err.message || "Failed to update record"}`)
    }
  }

  const handleDeleteDisease = async (id: string) => {
    if (!confirm(`Are you sure you want to delete disease '${id}'?`)) return
    try {
      await adminDeleteDisease(id)
      alert("Disease deleted successfully")
    } catch (err: any) {
      alert(`Error deleting disease: ${err.message}`)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600" />
      </div>
    )
  }

  return (
    <div className="space-y-8 py-4">
      <div className="space-y-2">
        <h1 className="text-3xl font-extrabold text-zinc-950 dark:text-zinc-50 flex items-center gap-2">
          <Shield className="h-7 w-7 text-green-650" />
          <span>Admin Dashboard</span>
        </h1>
        <p className="text-zinc-500 dark:text-zinc-400 text-sm">
          System analytics reports, registered user profiles, and plant disease library database manager.
        </p>
      </div>

      <Tabs defaultValue="reports" className="w-full space-y-6">
        <TabsList className="bg-zinc-100 dark:bg-zinc-900 p-1 rounded-xl h-11 border border-zinc-200/40 dark:border-zinc-800">
          <TabsTrigger value="reports" className="rounded-lg px-4 font-semibold text-xs py-2 flex items-center gap-1.5">
            <BarChart3 className="h-4 w-4" />
            <span>Reports & Analytics</span>
          </TabsTrigger>
          <TabsTrigger value="users" className="rounded-lg px-4 font-semibold text-xs py-2 flex items-center gap-1.5">
            <Users className="h-4 w-4" />
            <span>User Accounts ({users.length})</span>
          </TabsTrigger>
          <TabsTrigger value="diseases" className="rounded-lg px-4 font-semibold text-xs py-2 flex items-center gap-1.5">
            <Plus className="h-4 w-4" />
            <span>Disease Manager</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="reports" className="space-y-6">
          {reports && (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Card className="border border-zinc-100 dark:border-zinc-800 p-6 shadow-sm bg-white dark:bg-zinc-900/50">
                <span className="text-xs text-zinc-400 font-semibold uppercase">Total Users</span>
                <p className="text-3xl font-black mt-2 text-zinc-900 dark:text-zinc-50">{reports.total_users}</p>
              </Card>
              <Card className="border border-zinc-100 dark:border-zinc-800 p-6 shadow-sm bg-white dark:bg-zinc-900/50">
                <span className="text-xs text-zinc-400 font-semibold uppercase">Total Scans Run</span>
                <p className="text-3xl font-black mt-2 text-green-600 dark:text-green-400">{reports.total_scans}</p>
              </Card>
              
              <Card className="border border-zinc-100 dark:border-zinc-800 p-6 shadow-sm bg-white dark:bg-zinc-900/50 md:col-span-2">
                <span className="text-xs text-zinc-400 font-semibold uppercase">Scans by Severity</span>
                <div className="flex gap-4 mt-3 flex-wrap">
                  {Object.entries(reports.scans_by_severity).map(([sev, count]: any) => (
                    <span key={sev} className="text-xs font-semibold px-3 py-1 bg-zinc-50 dark:bg-zinc-950 border rounded-full capitalize">
                      {sev}: <strong className="text-green-600 ml-1">{count}</strong>
                    </span>
                  ))}
                </div>
              </Card>

              {/* Disease stats */}
              <Card className="border border-zinc-100 dark:border-zinc-800 p-6 shadow-sm bg-white dark:bg-zinc-900/50 md:col-span-4">
                <h3 className="font-bold text-sm text-zinc-800 dark:text-zinc-200 mb-4 uppercase tracking-wider">Top Detected Crop Diseases</h3>
                <div className="divide-y divide-zinc-50 dark:divide-zinc-850">
                  {Object.entries(reports.scans_by_disease).map(([name, count]: any) => (
                    <div key={name} className="flex justify-between py-2.5 text-sm">
                      <span className="font-medium text-zinc-700 dark:text-zinc-300">{name}</span>
                      <span className="font-bold text-green-600">{count} scans</span>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          )}
        </TabsContent>

        <TabsContent value="users">
          <Card className="border border-zinc-100 dark:border-zinc-800 shadow-sm bg-white dark:bg-zinc-900/50 rounded-2xl overflow-hidden">
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="bg-zinc-50 dark:bg-zinc-950 border-b border-zinc-100 dark:border-zinc-800">
                    <tr>
                      <th className="p-4 font-bold">User Name</th>
                      <th className="p-4 font-bold">Email Address</th>
                      <th className="p-4 font-bold">Role</th>
                      <th className="p-4 font-bold">Joined</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-100 dark:divide-zinc-850">
                    {users.map((user) => (
                      <tr key={user.id} className="hover:bg-zinc-50/50 dark:hover:bg-zinc-900/20">
                        <td className="p-4 font-medium text-zinc-900 dark:text-zinc-100">{user.full_name}</td>
                        <td className="p-4 text-zinc-500">{user.email}</td>
                        <td className="p-4">
                          <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-green-50 text-green-700 dark:bg-green-950/20 dark:text-green-400 capitalize">
                            {user.role}
                          </span>
                        </td>
                        <td className="p-4 text-zinc-500">{new Date(user.created_at).toLocaleDateString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="diseases" className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Editor Form */}
          <div className="lg:col-span-8 bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 p-6 rounded-2xl shadow-sm space-y-6">
            <h2 className="font-bold text-lg text-zinc-900 dark:text-zinc-100">Add or Edit Disease Entry</h2>
            
            {statusMessage && (
              <div className="flex gap-2 p-3 bg-amber-50 border border-amber-250 dark:bg-amber-950/20 dark:border-amber-900/30 rounded-xl text-amber-800 dark:text-amber-400 text-sm">
                <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
                <span>{statusMessage}</span>
              </div>
            )}

            <form onSubmit={handleDiseaseSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-zinc-500 uppercase mb-1">Disease ID (Unique Key)</label>
                  <Input placeholder="e.g. apple-black-rot" value={diseaseId} onChange={(e) => setDiseaseId(e.target.value)} required />
                </div>
                <div>
                  <label className="block text-xs font-bold text-zinc-500 uppercase mb-1">Slug (Matches Model Output)</label>
                  <Input placeholder="e.g. apple-black-rot" value={slug} onChange={(e) => setSlug(e.target.value)} required />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-xs font-bold text-zinc-500 uppercase mb-1">Disease Name (Display)</label>
                  <Input placeholder="e.g. Apple Black Rot" value={diseaseName} onChange={(e) => setDiseaseName(e.target.value)} required />
                </div>
                <div>
                  <label className="block text-xs font-bold text-zinc-500 uppercase mb-1">Crop Type</label>
                  <Input placeholder="e.g. Apple" value={cropType} onChange={(e) => setCropType(e.target.value)} required />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-zinc-500 uppercase mb-1">Severity</label>
                <select 
                  className="w-full h-11 border border-zinc-200 dark:border-zinc-800 rounded-xl bg-white dark:bg-zinc-950 px-3 text-sm"
                  value={severity} 
                  onChange={(e) => setSeverity(e.target.value)}
                >
                  <option value="low">Low</option>
                  <option value="moderate">Moderate</option>
                  <option value="severe">Severe</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-zinc-500 uppercase mb-1">Description</label>
                <textarea 
                  className="w-full border border-zinc-200 dark:border-zinc-800 rounded-xl bg-white dark:bg-zinc-950 p-3 text-sm h-24"
                  placeholder="Provide disease details..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-zinc-500 uppercase mb-1">Causes (One per line)</label>
                <textarea 
                  className="w-full border border-zinc-200 dark:border-zinc-800 rounded-xl bg-white dark:bg-zinc-950 p-3 text-sm h-20"
                  placeholder="Enter causes..."
                  value={causes}
                  onChange={(e) => setCauses(e.target.value)}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-zinc-500 uppercase mb-1">Treatment Steps (One per line)</label>
                  <textarea 
                    className="w-full border border-zinc-200 dark:border-zinc-800 rounded-xl bg-white dark:bg-zinc-950 p-3 text-sm h-24"
                    placeholder="Enter treatments..."
                    value={treatment}
                    onChange={(e) => setTreatment(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-zinc-500 uppercase mb-1">Prevention Steps (One per line)</label>
                  <textarea 
                    className="w-full border border-zinc-200 dark:border-zinc-800 rounded-xl bg-white dark:bg-zinc-950 p-3 text-sm h-24"
                    placeholder="Enter prevention steps..."
                    value={prevention}
                    onChange={(e) => setPrevention(e.target.value)}
                  />
                </div>
              </div>

              <Button type="submit" className="w-full bg-green-600 hover:bg-green-700 text-white rounded-xl h-11 font-semibold">
                Save Disease Record
              </Button>
            </form>
          </div>

          <div className="lg:col-span-4 bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 p-6 rounded-2xl shadow-sm space-y-4">
            <h2 className="font-bold text-base text-zinc-900 dark:text-zinc-100">Delete Disease Record</h2>
            <p className="text-xs text-zinc-500">Provide the unique ID of the disease record to remove it from database.</p>
            <div className="flex gap-2">
              <Input id="delete-id-input" placeholder="e.g. apple-black-rot" className="h-10" />
              <Button 
                variant="destructive"
                className="h-10 rounded-xl px-4"
                onClick={() => {
                  const input = document.getElementById("delete-id-input") as HTMLInputElement
                  if (input && input.value) {
                    handleDeleteDisease(input.value)
                  }
                }}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

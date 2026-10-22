"use client";

import { useState, useEffect } from "react";
import {
  User,
  Briefcase,
  Layers,
  Code,
  BookOpen,
  MessageSquare,
  Database,
  Save,
  LogOut,
  ExternalLink,
  Plus,
  Trash2,
  CheckCircle,
  AlertCircle,
  Loader2,
  Lock,
  Mail,
  Eye,
  EyeOff,
  RefreshCw,
  Sparkles,
  Upload,
  FileText,
  Image as ImageIcon,
  ImageOff,
  FolderUp,
  Copy,
  Check,
  RotateCcw,
  Quote,
  Code2,
  Calendar,
  Clock,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { ClaudeSpark } from "@/components/ClaudeSpark";

export default function DashboardPage() {
  const [auth, setAuth] = useState<boolean | null>(null);
  const [email, setEmail] = useState("admin@rythm.com");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [authError, setAuthError] = useState("");
  const [authLoading, setAuthLoading] = useState(false);

  const [activeTab, setActiveTab] = useState<
    "profile" | "experience" | "projects" | "skills" | "blog" | "messages" | "buckets" | "database"
  >("profile");

  const [data, setData] = useState<any>(null);

  // Contact messages are loaded separately from the content blob
  const [messages, setMessages] = useState<any[]>([]);
  const [messagesLoading, setMessagesLoading] = useState(false);
  const [messagesError, setMessagesError] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [saveError, setSaveError] = useState("");

  // Bucket / upload state
  const [bucketFiles, setBucketFiles] = useState<any[]>([]);
  const [bucketLoading, setBucketLoading] = useState(false);
  const [uploadingTarget, setUploadingTarget] = useState<string | null>(null);
  const [copiedUrl, setCopiedUrl] = useState<string | null>(null);

  // Supabase connection state
  const [dbUri, setDbUri] = useState("");
  const [dbStatus, setDbStatus] = useState<string | null>(null);
  const [dbLoading, setDbLoading] = useState(false);

  // Check auth on mount
  useEffect(() => {
    fetch("/api/auth")
      .then((res) => res.json())
      .then((res) => {
        setAuth(res.isAuthenticated);
        if (res.isAuthenticated) {
          loadData();
          loadMessages();
          loadBucketFiles();
        } else {
          setLoading(false);
        }
      })
      .catch(() => {
        setAuth(false);
        setLoading(false);
      });
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/data");
      const d = await res.json();
      setData(d);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const loadMessages = async () => {
    setMessagesLoading(true);
    setMessagesError("");
    try {
      const res = await fetch("/api/messages", { cache: "no-store" });
      const d = await res.json();
      if (!res.ok) throw new Error(d.error || "Failed to load messages");
      setMessages(d.messages || []);
    } catch (e: any) {
      setMessagesError(e.message || "Failed to load messages");
    } finally {
      setMessagesLoading(false);
    }
  };

  const removeMessage = async (id: string) => {
    const prev = messages;
    setMessages(messages.filter((m) => m.id !== id));
    const res = await fetch(`/api/messages?id=${encodeURIComponent(id)}`, { method: "DELETE" }).catch(() => null);
    if (!res?.ok) {
      setMessages(prev);
      setMessagesError("Could not delete that message. Please try again.");
    }
  };

  const loadBucketFiles = async () => {
    setBucketLoading(true);
    try {
      const res = await fetch("/api/upload");
      const d = await res.json();
      setBucketFiles(d.files || []);
    } catch (e) {
      console.error(e);
    } finally {
      setBucketLoading(false);
    }
  };

  const uploadFile = async (
    file: File,
    bucket: string = "portfolio-assets"
  ): Promise<string | null> => {
    try {
      const fd = new FormData();
      fd.append("file", file);
      fd.append("bucket", bucket);
      const res = await fetch("/api/upload", {
        method: "POST",
        body: fd,
      });
      const resJson = await res.json();
      if (resJson.success && resJson.url) {
        loadBucketFiles();
        return resJson.url;
      }
      alert(resJson.error || "Upload failed");
      return null;
    } catch (e: any) {
      alert(e.message || "Upload failed");
      return null;
    }
  };

  const deleteBucketFile = async (filename: string) => {
    if (!confirm(`Delete ${filename}?`)) return;
    try {
      await fetch("/api/upload", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ filename }),
      });
      loadBucketFiles();
    } catch (e) {
      console.error(e);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedUrl(text);
    setTimeout(() => setCopiedUrl(null), 2500);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthLoading(true);
    setAuthError("");

    try {
      const res = await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const result = await res.json();
      if (result.success) {
        setAuth(true);
        loadData();
        loadMessages();
      } else {
        setAuthError(result.error || "Invalid login credentials");
      }
    } catch {
      setAuthError("Network error. Please try again.");
    } finally {
      setAuthLoading(false);
    }
  };

  const handleLogout = async () => {
    await fetch("/api/auth", { method: "DELETE" });
    setAuth(false);
    setPassword("");
  };

  const handleSave = async () => {
    setSaving(true);
    setSaveSuccess(false);
    setSaveError("");
    try {
      const cleanData = JSON.parse(JSON.stringify(data));
      if (cleanData.skills) {
        cleanData.skills = cleanData.skills.map((s: any) => ({
          title: s.title || s.category || "General",
          category: s.title || s.category || "General",
          items: (s.items || []).map((it: string) => it.trim()).filter(Boolean),
        }));
      }
      const res = await fetch("/api/data", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(cleanData),
      });
      if (res.ok) {
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 3000);
      } else {
        const body = await res.json().catch(() => ({}));
        setSaveError(body.error || `Save failed (${res.status})`);
      }
    } catch (e) {
      console.error(e);
      setSaveError("Save failed — network error");
    } finally {
      setSaving(false);
    }
  };

  const handleTestDb = async () => {
    if (!dbUri) return;
    setDbLoading(true);
    setDbStatus(null);
    try {
      const res = await fetch("/api/supabase", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "test", connectionString: dbUri }),
      });
      const result = await res.json();
      setDbStatus(result.message);
    } catch (e: any) {
      setDbStatus(e.message || "Failed to test connection");
    } finally {
      setDbLoading(false);
    }
  };

  const handleSyncDb = async () => {
    if (!dbUri) return;
    setDbLoading(true);
    setDbStatus(null);
    try {
      const res = await fetch("/api/supabase", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "sync", connectionString: dbUri }),
      });
      const result = await res.json();
      setDbStatus(result.message);
    } catch (e: any) {
      setDbStatus(e.message || "Failed to sync");
    } finally {
      setDbLoading(false);
    }
  };

  // Login view
  if (!auth) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center p-4">
        <div className="w-full max-w-md rounded-3xl border border-line bg-surface p-8 shadow-card sm:p-10">
          <div className="mb-8 text-center">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl border border-line bg-surface text-accent shadow-sm">
              <ClaudeSpark className="h-9 w-9 text-accent" />
            </div>
            <h1 className="font-serif text-3xl font-normal tracking-tight text-ink">
              Studio CMS
            </h1>
            <p className="mt-2 text-sm text-muted">
              Portfolio & Database Management Studio
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            {authError && (
              <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-xs text-red-700 dark:border-red-900/40 dark:bg-red-950/40 dark:text-red-300 flex items-center gap-2">
                <AlertCircle size={15} />
                <span>{authError}</span>
              </div>
            )}

            <div>
              <label className="mb-1.5 block text-xs uppercase tracking-wider text-muted font-medium">
                Admin Email
              </label>
              <div className="flex items-center rounded-xl border border-line bg-bg px-3.5 py-2.5 transition-all focus-within:border-accent focus-within:ring-2 focus-within:ring-accent/20">
                <Mail size={16} className="text-muted mr-3 flex-shrink-0" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full bg-transparent text-sm text-ink outline-none placeholder:text-muted/60"
                  placeholder="admin@rythm.com"
                />
              </div>
            </div>

            <div>
              <label className="mb-1.5 block text-xs uppercase tracking-wider text-muted font-medium">
                Password
              </label>
              <div className="flex items-center rounded-xl border border-line bg-bg px-3.5 py-2.5 transition-all focus-within:border-accent focus-within:ring-2 focus-within:ring-accent/20">
                <Lock size={16} className="text-muted mr-3 flex-shrink-0" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full bg-transparent text-sm font-mono text-ink outline-none placeholder:text-muted/60"
                  placeholder="•••••••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-muted hover:text-ink ml-2 flex-shrink-0 transition-colors"
                  title={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={authLoading}
              className="btn-primary w-full justify-center !py-3 !text-sm mt-2"
            >
              {authLoading ? (
                <Loader2 size={16} className="animate-spin" />
              ) : (
                "Sign In to Dashboard"
              )}
            </button>
          </form>

          <div className="mt-8 border-t border-line pt-4 text-center text-xs text-muted">
            Authorized session for <strong className="text-ink">admin@rythm.com</strong>
          </div>
        </div>
      </main>
    );
  }

  if (loading || !data) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 size={24} className="animate-spin text-accent" />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col">
      {/* Top Navbar */}
      <header className="sticky top-0 z-40 border-b border-line bg-surface/90 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
          <div className="flex items-center gap-2.5">
            <ClaudeSpark className="h-6 w-6 text-accent" />
            <div>
              <h1 className="font-serif text-lg font-normal tracking-tight text-ink">
                Rythm Jagga <span className="text-xs text-muted font-sans font-normal ml-1">Studio CMS</span>
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <a
              href="http://localhost:3000"
              target="_blank"
              rel="noreferrer"
              className="btn-secondary !py-1.5 !px-3 !text-xs hidden sm:inline-flex"
            >
              <span>View Portfolio</span>
              <ExternalLink size={13} />
            </a>

            <button
              id="save-changes-btn"
              onClick={handleSave}
              disabled={saving}
              title={saveError || undefined}
              className={`btn-primary !py-1.5 !px-3.5 !text-xs ${saveError ? "!bg-red-600" : ""}`}
            >
              {saving ? (
                <Loader2 size={13} className="animate-spin" />
              ) : saveSuccess ? (
                <CheckCircle size={13} />
              ) : (
                <Save size={13} />
              )}
              <span>{saveSuccess ? "Saved!" : saveError ? "Save failed" : "Save Changes"}</span>
            </button>

            <button
              onClick={handleLogout}
              className="btn-secondary !py-1.5 !px-2.5 !text-xs text-muted hover:text-ink"
              title="Sign Out"
            >
              <LogOut size={14} />
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="mx-auto flex max-w-7xl overflow-x-auto px-4 sm:px-6 border-t border-line/50 text-xs">
          {[
            { id: "profile", label: "Profile & Hero", icon: User },
            { id: "experience", label: "Experience", icon: Briefcase },
            { id: "projects", label: "Projects", icon: Layers },
            { id: "skills", label: "Skills", icon: Code },
            { id: "blog", label: "Blog & Essays", icon: BookOpen },
            { id: "buckets", label: `Media & Buckets (${bucketFiles.length})`, icon: FolderUp },
            { id: "messages", label: `Messages (${messages.length})`, icon: MessageSquare },
            { id: "database", label: "Supabase DB", icon: Database },
          ].map((tab) => {
            const Icon = tab.icon;
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 border-b-2 px-4 py-3 font-medium whitespace-nowrap transition-colors ${
                  active
                    ? "border-accent text-accent-strong bg-accent/5"
                    : "border-transparent text-muted hover:text-ink hover:bg-sunken/40"
                }`}
              >
                <Icon size={14} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </header>

      {/* Main Content Area */}
      <main className="mx-auto w-full max-w-7xl flex-1 p-4 sm:p-6 lg:p-8">
        {/* ==================== TAB: PROFILE ==================== */}
        {activeTab === "profile" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between border-b border-line pb-4">
              <div>
                <h2 className="font-serif text-2xl tracking-tight">Identity & Profile</h2>
                <p className="text-xs text-muted">Update core biographical and contact attributes</p>
              </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-4 rounded-2xl border border-line bg-surface p-5 shadow-sm">
                <h3 className="font-serif text-lg font-medium">Basic Information</h3>
                <div>
                  <label className="mb-1 block text-xs text-muted uppercase">Full Name</label>
                  <input
                    value={data.profile.name || ""}
                    onChange={(e) =>
                      setData({ ...data, profile: { ...data.profile, name: e.target.value } })
                    }
                    className="field"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs text-muted uppercase">Role Title</label>
                  <input
                    value={data.profile.role || ""}
                    onChange={(e) =>
                      setData({ ...data, profile: { ...data.profile, role: e.target.value } })
                    }
                    className="field"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs text-muted uppercase">Location</label>
                  <input
                    value={data.profile.location || ""}
                    onChange={(e) =>
                      setData({ ...data, profile: { ...data.profile, location: e.target.value } })
                    }
                    className="field"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs text-muted uppercase">Email Address</label>
                  <input
                    value={data.profile.email || ""}
                    onChange={(e) =>
                      setData({ ...data, profile: { ...data.profile, email: e.target.value } })
                    }
                    className="field"
                  />
                </div>
                {/* Profile Portrait / Avatar Photo */}
                <div className="pt-2 border-t border-line/50">
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-xs text-muted uppercase font-medium">
                      Profile Portrait / Photo
                    </label>
                    {(!data.profile.avatar || data.profile.avatar === "/profile.svg") ? (
                      <span className="text-[11px] text-accent font-medium inline-flex items-center gap-1">
                        <CheckCircle size={12} /> Default Illustration Active
                      </span>
                    ) : (
                      <span className="text-[11px] text-muted">
                        Custom photo active
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="relative h-20 w-16 overflow-hidden rounded-t-[999px] rounded-b-xl border border-line bg-sunken flex items-center justify-center shadow-inner flex-shrink-0">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={data.profile.avatar || "/profile.svg"}
                        alt="Profile avatar"
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div className="flex-1 space-y-2">
                      <div className="flex flex-wrap items-center gap-2">
                        <label className="btn-secondary !py-1.5 !px-3 !text-xs cursor-pointer inline-flex items-center gap-1.5 hover:border-accent">
                          {uploadingTarget === "avatar" ? (
                            <Loader2 size={13} className="animate-spin text-accent" />
                          ) : (
                            <Upload size={13} className="text-accent" />
                          )}
                          <span>Upload Custom Photo</span>
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            disabled={uploadingTarget === "avatar"}
                            onChange={async (e) => {
                              const file = e.target.files?.[0];
                              if (!file) return;
                              setUploadingTarget("avatar");
                              const url = await uploadFile(file, "portfolio-assets");
                              if (url) {
                                setData({ ...data, profile: { ...data.profile, avatar: url } });
                              }
                              setUploadingTarget(null);
                            }}
                          />
                        </label>
                        <button
                          type="button"
                          onClick={() =>
                            setData({ ...data, profile: { ...data.profile, avatar: "/profile.svg" } })
                          }
                          className="btn-secondary !py-1.5 !px-3 !text-xs inline-flex items-center gap-1.5 text-accent-strong hover:border-accent"
                          title="Restore default editorial portrait illustration"
                        >
                          <RotateCcw size={12} />
                          <span>Set Default Portrait</span>
                        </button>
                      </div>
                      <div className="flex items-center gap-2">
                        <input
                          value={data.profile.avatar || "/profile.svg"}
                          placeholder="/profile.svg"
                          onChange={(e) =>
                            setData({ ...data, profile: { ...data.profile, avatar: e.target.value } })
                          }
                          className="field !text-xs font-mono !py-1"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* CV / Resume PDF Upload */}
                <div className="pt-2 border-t border-line/50">
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-xs text-muted uppercase font-medium">
                      CV / Resume PDF
                    </label>
                    {data.profile.cv && (
                      <a
                        href={data.profile.cv}
                        target="_blank"
                        rel="noreferrer"
                        className="text-[11px] text-accent hover:underline flex items-center gap-1"
                      >
                        <Eye size={12} /> View Current
                      </a>
                    )}
                  </div>
                  <div className="space-y-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <label className="btn-secondary !py-1.5 !px-3 !text-xs cursor-pointer inline-flex items-center gap-1.5 hover:border-accent">
                        {uploadingTarget === "cv" ? (
                          <Loader2 size={13} className="animate-spin text-accent" />
                        ) : (
                          <Upload size={13} className="text-accent" />
                        )}
                        <span>Upload PDF Resume</span>
                        <input
                          type="file"
                          accept=".pdf,application/pdf"
                          className="hidden"
                          disabled={uploadingTarget === "cv"}
                          onChange={async (e) => {
                            const file = e.target.files?.[0];
                            if (!file) return;
                            setUploadingTarget("cv");
                            const url = await uploadFile(file, "resumes");
                            if (url) {
                              setData({ ...data, profile: { ...data.profile, cv: url } });
                            }
                            setUploadingTarget(null);
                          }}
                        />
                      </label>
                      <span className="text-[11px] text-muted">
                        Stored in <code className="bg-sunken px-1 rounded font-mono text-[10px]">resumes</code> bucket
                      </span>
                    </div>
                    <input
                      value={data.profile.cv || ""}
                      placeholder="/Rythm_CV.pdf or uploaded PDF url"
                      onChange={(e) =>
                        setData({ ...data, profile: { ...data.profile, cv: e.target.value } })
                      }
                      className="field !text-xs font-mono !py-1"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-4 rounded-2xl border border-line bg-surface p-5 shadow-sm">
                <h3 className="font-serif text-lg font-medium">Hero Tagline & Socials</h3>
                <div>
                  <label className="mb-1 block text-xs text-muted uppercase">Tagline / Mission</label>
                  <textarea
                    rows={4}
                    value={data.profile.tagline || ""}
                    onChange={(e) =>
                      setData({ ...data, profile: { ...data.profile, tagline: e.target.value } })
                    }
                    className="field resize-y"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs text-muted uppercase">GitHub Profile URL</label>
                  <input
                    value={data.profile.socials?.github || ""}
                    onChange={(e) =>
                      setData({
                        ...data,
                        profile: {
                          ...data.profile,
                          socials: { ...data.profile.socials, github: e.target.value },
                        },
                      })
                    }
                    className="field"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs text-muted uppercase">LinkedIn Profile URL</label>
                  <input
                    value={data.profile.socials?.linkedin || ""}
                    onChange={(e) =>
                      setData({
                        ...data,
                        profile: {
                          ...data.profile,
                          socials: { ...data.profile.socials, linkedin: e.target.value },
                        },
                      })
                    }
                    className="field"
                  />
                </div>
              </div>
            </div>

            {/* About Paragraphs */}
            <div className="rounded-2xl border border-line bg-surface p-5 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-serif text-lg font-medium">About Paragraphs</h3>
                <button
                  type="button"
                  onClick={() => {
                    const about = [...(data.profile.about || []), ""];
                    setData({ ...data, profile: { ...data.profile, about } });
                  }}
                  className="btn-secondary !py-1 !px-2.5 !text-xs"
                >
                  <Plus size={13} /> Add Paragraph
                </button>
              </div>

              {data.profile.about?.map((p: string, i: number) => (
                <div key={i} className="flex gap-2">
                  <textarea
                    rows={3}
                    value={p}
                    onChange={(e) => {
                      const about = [...data.profile.about];
                      about[i] = e.target.value;
                      setData({ ...data, profile: { ...data.profile, about } });
                    }}
                    className="field flex-1"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      const about = data.profile.about.filter((_: any, idx: number) => idx !== i);
                      setData({ ...data, profile: { ...data.profile, about } });
                    }}
                    className="p-2 text-muted hover:text-red-500"
                    title="Remove paragraph"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ==================== TAB: EXPERIENCE ==================== */}
        {activeTab === "experience" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between border-b border-line pb-4">
              <div>
                <h2 className="font-serif text-2xl tracking-tight">Work Experience</h2>
                <p className="text-xs text-muted">Manage roles, timelines, and accomplishments</p>
              </div>
              <button
                type="button"
                onClick={() => {
                  const newExp = {
                    company: "New Company",
                    role: "Software Engineer",
                    period: "2026 — Present",
                    summary: "Key contribution summary...",
                    points: ["Architected...", "Delivered..."],
                  };
                  setData({ ...data, experience: [newExp, ...data.experience] });
                }}
                className="btn-primary !py-1.5 !px-3 !text-xs"
              >
                <Plus size={14} /> Add Role
              </button>
            </div>

            <div className="space-y-5">
              {data.experience?.map((exp: any, i: number) => (
                <div
                  key={i}
                  className="rounded-2xl border border-line bg-surface p-5 shadow-sm space-y-4"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="grid gap-3 sm:grid-cols-3 flex-1">
                      <div>
                        <label className="text-[11px] text-muted uppercase">Role</label>
                        <input
                          value={exp.role || ""}
                          onChange={(e) => {
                            const experience = [...data.experience];
                            experience[i].role = e.target.value;
                            setData({ ...data, experience });
                          }}
                          className="field mt-1"
                        />
                      </div>
                      <div>
                        <label className="text-[11px] text-muted uppercase">Company</label>
                        <input
                          value={exp.company || ""}
                          onChange={(e) => {
                            const experience = [...data.experience];
                            experience[i].company = e.target.value;
                            setData({ ...data, experience });
                          }}
                          className="field mt-1"
                        />
                      </div>
                      <div>
                        <label className="text-[11px] text-muted uppercase">Period</label>
                        <input
                          value={exp.period || ""}
                          onChange={(e) => {
                            const experience = [...data.experience];
                            experience[i].period = e.target.value;
                            setData({ ...data, experience });
                          }}
                          className="field mt-1"
                        />
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        const experience = data.experience.filter((_: any, idx: number) => idx !== i);
                        setData({ ...data, experience });
                      }}
                      className="p-2 text-muted hover:text-red-500"
                      title="Delete experience"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>

                  <div>
                    <label className="text-[11px] text-muted uppercase">Summary</label>
                    <input
                      value={exp.summary || ""}
                      onChange={(e) => {
                        const experience = [...data.experience];
                        experience[i].summary = e.target.value;
                        setData({ ...data, experience });
                      }}
                      className="field mt-1"
                    />
                  </div>

                  {/* Bullet Points */}
                  <div className="space-y-2 pt-2">
                    <label className="text-[11px] text-muted uppercase font-medium">Achievements / Points</label>
                    {exp.points?.map((pt: string, pIdx: number) => (
                      <div key={pIdx} className="flex gap-2">
                        <input
                          value={pt}
                          onChange={(e) => {
                            const experience = [...data.experience];
                            experience[i].points[pIdx] = e.target.value;
                            setData({ ...data, experience });
                          }}
                          className="field text-sm"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            const experience = [...data.experience];
                            experience[i].points = experience[i].points.filter((_: any, idx: number) => idx !== pIdx);
                            setData({ ...data, experience });
                          }}
                          className="p-1.5 text-muted hover:text-red-500"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={() => {
                        const experience = [...data.experience];
                        experience[i].points = [...(experience[i].points || []), ""];
                        setData({ ...data, experience });
                      }}
                      className="btn-secondary !py-1 !px-2.5 !text-xs mt-1"
                    >
                      <Plus size={12} /> Add Point
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ==================== TAB: PROJECTS ==================== */}
        {activeTab === "projects" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between border-b border-line pb-4">
              <div>
                <h2 className="font-serif text-2xl tracking-tight">Projects</h2>
                <p className="text-xs text-muted">Showcase engineering work, demo links, and metrics</p>
              </div>
              <button
                type="button"
                onClick={() => {
                  const newProj = {
                    title: "New Project",
                    blurb: "High-level overview of the engineering challenge...",
                    description: "High-level overview of the engineering challenge...",
                    category: "Web & Mobile",
                    period: "2026",
                    metric: "10k+ requests/sec",
                    tags: ["TypeScript", "Next.js"],
                    github: "https://github.com/Rythmokay/",
                    repo: "https://github.com/Rythmokay/",
                    demo: "https://example.com",
                    live: "https://example.com",
                    image: "",
                    featured: true,
                    points: ["Key feature 1", "Key feature 2"],
                  };
                  setData({ ...data, projects: [newProj, ...data.projects] });
                }}
                className="btn-primary !py-1.5 !px-3 !text-xs"
              >
                <Plus size={14} /> Add Project
              </button>
            </div>

            <div className="space-y-5">
              {data.projects?.map((proj: any, i: number) => (
                <div
                  key={i}
                  className="rounded-2xl border border-line bg-surface p-5 shadow-sm space-y-4"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="grid gap-3 sm:grid-cols-3 flex-1">
                      <div>
                        <label className="text-[11px] text-muted uppercase">Project Title</label>
                        <input
                          value={proj.title || ""}
                          onChange={(e) => {
                            const projects = [...data.projects];
                            projects[i].title = e.target.value;
                            setData({ ...data, projects });
                          }}
                          className="field mt-1"
                        />
                      </div>
                      <div>
                        <label className="text-[11px] text-muted uppercase">Category</label>
                        <input
                          value={proj.category || ""}
                          onChange={(e) => {
                            const projects = [...data.projects];
                            projects[i].category = e.target.value;
                            setData({ ...data, projects });
                          }}
                          className="field mt-1"
                        />
                      </div>
                      <div>
                        <label className="text-[11px] text-muted uppercase">Metric / Highlight</label>
                        <input
                          value={proj.metric || ""}
                          onChange={(e) => {
                            const projects = [...data.projects];
                            projects[i].metric = e.target.value;
                            setData({ ...data, projects });
                          }}
                          className="field mt-1"
                          placeholder="e.g. 500+ daily orders"
                        />
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        const projects = data.projects.filter((_: any, idx: number) => idx !== i);
                        setData({ ...data, projects });
                      }}
                      className="p-2 text-muted hover:text-red-500"
                      title="Delete project"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>

                  <div>
                    <label className="text-[11px] text-muted uppercase">Description</label>
                    <textarea
                      rows={2}
                      value={proj.blurb || proj.description || ""}
                      onChange={(e) => {
                        const projects = [...data.projects];
                        projects[i].blurb = e.target.value;
                        projects[i].description = e.target.value;
                        setData({ ...data, projects });
                      }}
                      className="field mt-1"
                    />
                  </div>

                  <div className="grid gap-3 sm:grid-cols-2">
                    <div>
                      <label className="text-[11px] text-muted uppercase">GitHub / Source Link</label>
                      <input
                        value={proj.repo || proj.github || ""}
                        onChange={(e) => {
                          const projects = [...data.projects];
                          projects[i].repo = e.target.value;
                          projects[i].github = e.target.value;
                          setData({ ...data, projects });
                        }}
                        className="field mt-1"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] text-muted uppercase">Live Demo Link</label>
                      <input
                        value={proj.live || proj.demo || ""}
                        onChange={(e) => {
                          const projects = [...data.projects];
                          projects[i].live = e.target.value;
                          projects[i].demo = e.target.value;
                          setData({ ...data, projects });
                        }}
                        className="field mt-1"
                      />
                    </div>
                  </div>

                  {/* Project Screenshot / Cover Image Section */}
                  <div className="space-y-2 pt-1 border-t border-line/60">
                    <div className="flex flex-wrap items-center justify-between gap-2 pb-1">
                      <div className="flex items-center gap-2">
                        <label className="text-[11px] text-muted uppercase font-medium">Project Screenshot / Cover</label>
                        {proj.image ? (
                          <span className="text-[11px] text-accent font-medium inline-flex items-center gap-1">
                            <CheckCircle size={12} /> Image Active
                          </span>
                        ) : (
                          <span className="text-[11px] text-muted inline-flex items-center gap-1">
                            <ImageOff size={12} /> No Image (Uses Typographic Card)
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-2">
                        <label className="btn-secondary !py-1 !px-2.5 !text-xs cursor-pointer inline-flex items-center gap-1.5 hover:border-accent">
                          {uploadingTarget === `project-img-${i}` ? (
                            <Loader2 size={12} className="animate-spin text-accent" />
                          ) : (
                            <Upload size={12} className="text-accent" />
                          )}
                          <span>Upload Screenshot</span>
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            disabled={uploadingTarget === `project-img-${i}`}
                            onChange={async (e) => {
                              const file = e.target.files?.[0];
                              if (!file) return;
                              setUploadingTarget(`project-img-${i}`);
                              const url = await uploadFile(file, "portfolio-assets");
                              if (url) {
                                const projects = [...data.projects];
                                projects[i].image = url;
                                setData({ ...data, projects });
                              }
                              setUploadingTarget(null);
                            }}
                          />
                        </label>

                        {proj.image && (
                          <button
                            type="button"
                            onClick={() => {
                              const projects = [...data.projects];
                              projects[i].image = "";
                              setData({ ...data, projects });
                            }}
                            className="btn-secondary !py-1 !px-2.5 !text-xs inline-flex items-center gap-1.5 hover:border-red-400 text-red-500 hover:text-red-600"
                            title="Remove project screenshot"
                          >
                            <Trash2 size={12} />
                            <span>Remove Image</span>
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Always visible preview card and input controls */}
                    <div className="rounded-xl border border-line bg-sunken/40 p-3.5 space-y-2">
                      <div className="flex flex-col sm:flex-row gap-4 items-start">
                        {/* Live Preview or Typographic Placeholder */}
                        <div className="relative w-full sm:w-52 aspect-[16/10] rounded-lg border border-line bg-surface overflow-hidden flex-shrink-0 shadow-sm flex items-center justify-center">
                          {proj.image ? (
                            <>
                              {/* eslint-disable-next-line @next/next/no-img-element */}
                              <img
                                src={proj.image}
                                alt={proj.title || "Project screenshot preview"}
                                className="h-full w-full object-cover"
                                onError={(e) => {
                                  (e.currentTarget as HTMLElement).style.display = "none";
                                  const fb = e.currentTarget.nextElementSibling as HTMLElement;
                                  if (fb) fb.style.display = "flex";
                                }}
                              />
                              <div className="hidden h-full w-full items-center justify-center p-2 text-center text-[11px] text-red-500 bg-sunken">
                                <AlertCircle size={13} className="mr-1 inline" /> Failed to load
                              </div>
                              <span className="absolute bottom-1.5 left-1.5 rounded bg-surface/90 px-1.5 py-0.5 font-mono text-[10px] text-muted border border-line shadow-xs">
                                Live Preview
                              </span>
                            </>
                          ) : (
                            <div className="relative flex h-full w-full items-end justify-between p-3 bg-sunken/60">
                              <span
                                aria-hidden
                                className="absolute -right-2 -top-4 select-none text-[5rem] italic leading-none text-accent/20"
                              >
                                {String(i + 1).padStart(2, "0")}
                              </span>
                              <span className="text-[10px] uppercase font-mono tracking-wider text-muted">
                                Plate No. {i + 1}
                              </span>
                              <span className="text-[10px] text-muted italic">Typographic Mode</span>
                            </div>
                          )}
                        </div>

                        {/* Input & Upload Controls */}
                        <div className="flex-1 w-full space-y-2">
                          <div>
                            <label className="text-[11px] text-muted uppercase font-medium">Screenshot Path / URL</label>
                            <div className="flex items-center gap-2 mt-1">
                              <input
                                value={proj.image || ""}
                                onChange={(e) => {
                                  const projects = [...data.projects];
                                  projects[i].image = e.target.value;
                                  setData({ ...data, projects });
                                }}
                                className="field text-xs font-mono !py-1.5 flex-1"
                                placeholder="/uploads/screenshot.png or image URL"
                              />
                              {proj.image && (
                                <button
                                  type="button"
                                  onClick={() => {
                                    const projects = [...data.projects];
                                    projects[i].image = "";
                                    setData({ ...data, projects });
                                  }}
                                  className="btn-secondary !py-1.5 !px-2.5 !text-xs text-red-500 hover:text-red-600 hover:border-red-400 shrink-0"
                                  title="Clear image path"
                                >
                                  Clear
                                </button>
                              )}
                            </div>
                          </div>
                          <p className="text-[11px] text-muted leading-relaxed">
                            {proj.image
                              ? "Live screenshot active. Displayed with a smooth zoom effect on the homepage project card."
                              : "Enter a path, paste an image URL, or click \"Upload Screenshot\" to activate the visual project card."}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="text-[11px] text-muted uppercase">Tech Tags (comma separated)</label>
                    <input
                      value={proj.tags?.join(", ") || ""}
                      onChange={(e) => {
                        const projects = [...data.projects];
                        projects[i].tags = e.target.value.split(",").map((s) => s.trim()).filter(Boolean);
                        setData({ ...data, projects });
                      }}
                      className="field mt-1"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ==================== TAB: SKILLS ==================== */}
        {activeTab === "skills" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between border-b border-line pb-4">
              <div>
                <h2 className="font-serif text-2xl tracking-tight">Skills & Tech Stack</h2>
                <p className="text-xs text-muted">Grouped categories and technology tags</p>
              </div>
              <button
                type="button"
                onClick={() => {
                  const newSkill = {
                    title: "New Category",
                    category: "New Category",
                    items: ["Technology 1", "Technology 2"],
                  };
                  setData({ ...data, skills: [...(data.skills || []), newSkill] });
                }}
                className="btn-primary !py-1.5 !px-3 !text-xs"
              >
                <Plus size={14} /> Add Category
              </button>
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              {(data.skills || []).map((cat: any, i: number) => (
                <div
                  key={i}
                  className="rounded-2xl border border-line bg-surface p-5 shadow-sm space-y-4"
                >
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex-1">
                      <label className="text-[11px] font-medium uppercase tracking-wider text-muted mb-1 block">
                        Category Name
                      </label>
                      <input
                        value={cat.title ?? cat.category ?? ""}
                        placeholder="e.g. Back End & Architecture"
                        onChange={(e) => {
                          const skills = [...data.skills];
                          skills[i] = {
                            ...skills[i],
                            title: e.target.value,
                            category: e.target.value,
                          };
                          setData({ ...data, skills });
                        }}
                        className="font-serif text-lg font-medium field !p-2 !bg-sunken/40 focus:!border-accent w-full"
                      />
                    </div>
                    <button
                      type="button"
                      title="Delete category"
                      onClick={() => {
                        const skills = data.skills.filter((_: any, idx: number) => idx !== i);
                        setData({ ...data, skills });
                      }}
                      className="mt-5 p-2 rounded-lg text-muted hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>

                  <div>
                    <label className="text-[11px] font-medium uppercase tracking-wider text-muted block mb-1">
                      Skills (comma separated)
                    </label>
                    <textarea
                      rows={3}
                      placeholder="e.g. Java, Spring Boot, RESTful Web Services, Docker"
                      value={
                        cat._rawItems !== undefined
                          ? cat._rawItems
                          : Array.isArray(cat.items)
                          ? cat.items.join(", ")
                          : ""
                      }
                      onChange={(e) => {
                        const val = e.target.value;
                        const skills = [...data.skills];
                        skills[i] = {
                          ...skills[i],
                          items: val.split(",").map((s) => s.trim()),
                          _rawItems: val,
                        };
                        setData({ ...data, skills });
                      }}
                      className="field font-mono text-xs leading-relaxed"
                    />
                  </div>

                  {/* Live preview chips */}
                  {Array.isArray(cat.items) && cat.items.filter(Boolean).length > 0 && (
                    <div className="pt-2 border-t border-line/60">
                      <div className="flex flex-wrap gap-1.5">
                        {cat.items.filter(Boolean).map((item: string, itemIdx: number) => (
                          <span
                            key={itemIdx}
                            className="inline-flex items-center rounded-md border border-line bg-sunken/70 px-2 py-0.5 text-xs text-ink/80"
                          >
                            {item}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ==================== TAB: BLOG & ESSAYS ==================== */}
        {activeTab === "blog" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between border-b border-line pb-4">
              <div>
                <h2 className="font-serif text-2xl tracking-tight">Essays & Articles</h2>
                <p className="text-xs text-muted">Author and publish technical writings</p>
              </div>
              <button
                type="button"
                onClick={() => {
                  const newPost = {
                    slug: "new-essay-" + Date.now(),
                    title: "Untitled Essay",
                    subtitle: "Brief subtitle explaining the technical premise...",
                    date: new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" }),
                    readTime: "4 min read",
                    tags: ["Engineering", "Architecture"],
                    featured: false,
                    coverImage: "/blog-software-prose.jpg",
                    coverCaption: "Fig. 1 — Architectural harmony.",
                    excerpt: "A brief introductory hook for readers...",
                    content: {
                      intro: ["Opening premise..."],
                      sections: [
                        {
                          heading: "1. Core Philosophy",
                          paragraphs: ["Explaining the domain details..."],
                        },
                      ],
                      conclusion: "Final takeaways...",
                    },
                  };
                  setData({ ...data, blogs: [newPost, ...data.blogs] });
                }}
                className="btn-primary !py-1.5 !px-3 !text-xs"
              >
                <Plus size={14} /> New Essay
              </button>
            </div>

            <div className="space-y-6">
              {data.blogs?.map((b: any, i: number) => (
                <div
                  key={i}
                  className="rounded-2xl border border-line bg-surface p-6 shadow-sm space-y-4"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="grid gap-3 sm:grid-cols-2 flex-1">
                      <div>
                        <label className="text-[11px] text-muted uppercase">Title</label>
                        <input
                          value={b.title || ""}
                          onChange={(e) => {
                            const blogs = [...data.blogs];
                            blogs[i].title = e.target.value;
                            setData({ ...data, blogs });
                          }}
                          className="field mt-1 font-serif text-lg"
                        />
                      </div>
                      <div>
                        <label className="text-[11px] text-muted uppercase">Slug (URL path)</label>
                        <input
                          value={b.slug || ""}
                          onChange={(e) => {
                            const blogs = [...data.blogs];
                            blogs[i].slug = e.target.value;
                            setData({ ...data, blogs });
                          }}
                          className="field mt-1 font-mono text-xs"
                        />
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        const blogs = data.blogs.filter((_: any, idx: number) => idx !== i);
                        setData({ ...data, blogs });
                      }}
                      className="p-2 text-muted hover:text-red-500"
                      title="Delete post"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>

                  <div>
                    <label className="text-[11px] text-muted uppercase">Subtitle</label>
                    <input
                      value={b.subtitle || ""}
                      onChange={(e) => {
                        const blogs = [...data.blogs];
                        blogs[i].subtitle = e.target.value;
                        setData({ ...data, blogs });
                      }}
                      className="field mt-1"
                    />
                  </div>

                  <div className="grid gap-3 sm:grid-cols-3">
                    <div>
                      <label className="text-[11px] text-muted uppercase font-medium flex items-center gap-1">
                        <Calendar size={12} className="text-accent" /> Publication Date
                      </label>
                      <input
                        value={b.date || ""}
                        onChange={(e) => {
                          const blogs = [...data.blogs];
                          blogs[i].date = e.target.value;
                          setData({ ...data, blogs });
                        }}
                        className="field mt-1 text-xs !py-1.5"
                        placeholder="e.g. October 18, 2026"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] text-muted uppercase font-medium flex items-center gap-1">
                        <Clock size={12} className="text-accent" /> Read Time
                      </label>
                      <input
                        value={b.readTime || ""}
                        onChange={(e) => {
                          const blogs = [...data.blogs];
                          blogs[i].readTime = e.target.value;
                          setData({ ...data, blogs });
                        }}
                        className="field mt-1 text-xs !py-1.5"
                        placeholder="e.g. 6 min read"
                      />
                    </div>
                    <div className="flex items-center sm:pt-5">
                      <label className="flex items-center gap-2 cursor-pointer text-xs font-medium text-foreground select-none">
                        <input
                          type="checkbox"
                          checked={!!b.featured}
                          onChange={(e) => {
                            const blogs = [...data.blogs];
                            blogs[i].featured = e.target.checked;
                            setData({ ...data, blogs });
                          }}
                          className="h-4 w-4 rounded border-line text-accent focus:ring-accent accent-accent"
                        />
                        <span>Featured on Homepage</span>
                      </label>
                    </div>
                  </div>

                  {/* Blog Cover Image Section */}
                  <div className="space-y-2 pt-1">
                    <div className="flex flex-wrap items-center justify-between gap-2 border-b border-line/60 pb-2">
                      <div className="flex items-center gap-2">
                        <label className="text-[11px] text-muted uppercase font-medium">Cover Image / Artwork</label>
                        {b.coverImage === "/blog-software-prose.jpg" ? (
                          <span className="text-[11px] text-accent font-medium inline-flex items-center gap-1">
                            <CheckCircle size={12} /> Default Prose Image Active
                          </span>
                        ) : b.coverImage ? (
                          <span className="text-[11px] text-muted font-medium inline-flex items-center gap-1">
                            <CheckCircle size={12} /> Custom Image Active
                          </span>
                        ) : (
                          <span className="text-[11px] text-amber-600 dark:text-amber-400 font-medium inline-flex items-center gap-1">
                            <ImageOff size={12} /> No Cover Image (Text-Only Essay)
                          </span>
                        )}
                      </div>

                      <div className="flex flex-wrap items-center gap-2">
                        <label className="btn-secondary !py-1 !px-2.5 !text-xs cursor-pointer inline-flex items-center gap-1.5 hover:border-accent">
                          {uploadingTarget === `blog-cover-${i}` ? (
                            <Loader2 size={12} className="animate-spin text-accent" />
                          ) : (
                            <Upload size={12} className="text-accent" />
                          )}
                          <span>Upload Image</span>
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            disabled={uploadingTarget === `blog-cover-${i}`}
                            onChange={async (e) => {
                              const file = e.target.files?.[0];
                              if (!file) return;
                              setUploadingTarget(`blog-cover-${i}`);
                              const url = await uploadFile(file, "portfolio-assets");
                              if (url) {
                                const blogs = [...data.blogs];
                                blogs[i].coverImage = url;
                                setData({ ...data, blogs });
                              }
                              setUploadingTarget(null);
                            }}
                          />
                        </label>

                        <button
                          type="button"
                          onClick={() => {
                            const blogs = [...data.blogs];
                            blogs[i].coverImage = "/blog-software-prose.jpg";
                            setData({ ...data, blogs });
                          }}
                          className="btn-secondary !py-1 !px-2.5 !text-xs inline-flex items-center gap-1.5 hover:border-accent text-accent-strong"
                          title="Set default Software Prose illustration"
                        >
                          <RotateCcw size={12} />
                          <span>Set Default Image</span>
                        </button>

                        {b.coverImage ? (
                          <button
                            type="button"
                            onClick={() => {
                              const blogs = [...data.blogs];
                              blogs[i].coverImage = "";
                              setData({ ...data, blogs });
                            }}
                            className="btn-secondary !py-1 !px-2.5 !text-xs inline-flex items-center gap-1.5 hover:border-red-400 text-red-500 hover:text-red-600"
                            title="Remove cover image from this essay"
                          >
                            <Trash2 size={12} />
                            <span>Remove Image</span>
                          </button>
                        ) : (
                          <button
                            type="button"
                            onClick={() => {
                              const blogs = [...data.blogs];
                              blogs[i].coverImage = "/blog-software-prose.jpg";
                              setData({ ...data, blogs });
                            }}
                            className="btn-primary !py-1 !px-2.5 !text-xs inline-flex items-center gap-1.5"
                            title="Include cover image"
                          >
                            <ImageIcon size={12} />
                            <span>Include Image</span>
                          </button>
                        )}
                      </div>
                    </div>

                    {b.coverImage ? (
                      <div className="rounded-xl border border-line bg-sunken/40 p-3.5 space-y-3">
                        <div className="flex flex-col sm:flex-row gap-4 items-start">
                          <div className="relative w-full sm:w-56 aspect-[16/10] rounded-lg border border-line bg-surface overflow-hidden flex-shrink-0 shadow-sm">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={b.coverImage}
                              alt={b.title || "Cover preview"}
                              className="h-full w-full object-cover"
                            />
                            <span className="absolute bottom-1.5 left-1.5 rounded bg-surface/90 px-1.5 py-0.5 font-mono text-[10px] text-muted border border-line shadow-xs">
                              Live Preview
                            </span>
                          </div>

                          <div className="flex-1 w-full space-y-2.5">
                            <div>
                              <label className="text-[11px] text-muted uppercase font-medium">Image Source Path / URL</label>
                              <input
                                value={b.coverImage || ""}
                                onChange={(e) => {
                                  const blogs = [...data.blogs];
                                  blogs[i].coverImage = e.target.value;
                                  setData({ ...data, blogs });
                                }}
                                className="field mt-1 text-xs font-mono !py-1.5"
                                placeholder="/blog-software-prose.jpg or upload URL"
                              />
                            </div>
                            <div>
                              <label className="text-[11px] text-muted uppercase font-medium">Cover Caption</label>
                              <input
                                value={b.coverCaption || ""}
                                onChange={(e) => {
                                  const blogs = [...data.blogs];
                                  blogs[i].coverCaption = e.target.value;
                                  setData({ ...data, blogs });
                                }}
                                className="field mt-1 text-xs !py-1.5"
                                placeholder="e.g. Fig. 1 — Architectural harmony between domain layers."
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="rounded-xl border border-dashed border-line bg-sunken/20 p-4 flex flex-col sm:flex-row items-center justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-lg bg-surface border border-line flex items-center justify-center text-muted shrink-0">
                            <ImageOff size={18} />
                          </div>
                          <div>
                            <p className="text-xs font-medium text-foreground">No cover image included</p>
                            <p className="text-[11px] text-muted">
                              This essay will render with a pure typography & prose focus without a header illustration.
                            </p>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            const blogs = [...data.blogs];
                            blogs[i].coverImage = "/blog-software-prose.jpg";
                            setData({ ...data, blogs });
                          }}
                          className="btn-secondary !py-1.5 !px-3 !text-xs inline-flex items-center gap-1.5 hover:border-accent text-accent-strong shrink-0"
                        >
                          <RotateCcw size={12} />
                          <span>Set Default Image</span>
                        </button>
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="text-[11px] text-muted uppercase">Tags (comma separated)</label>
                    <input
                      value={b.tags?.join(", ") || ""}
                      onChange={(e) => {
                        const blogs = [...data.blogs];
                        blogs[i].tags = e.target.value.split(",").map((s) => s.trim()).filter(Boolean);
                        setData({ ...data, blogs });
                      }}
                      className="field mt-1"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] text-muted uppercase">Excerpt</label>
                    <textarea
                      rows={2}
                      value={b.excerpt || ""}
                      onChange={(e) => {
                        const blogs = [...data.blogs];
                        blogs[i].excerpt = e.target.value;
                        setData({ ...data, blogs });
                      }}
                      className="field mt-1"
                    />
                  </div>

                  {/* ==================== FULL ARTICLE CONTENT EDITOR ==================== */}
                  <div className="mt-4 pt-4 border-t border-line/80 space-y-6">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div>
                        <h3 className="font-serif text-lg tracking-tight text-foreground flex items-center gap-2">
                          <FileText size={16} className="text-accent" /> Article Body & Editorial Sections
                        </h3>
                        <p className="text-xs text-muted">
                          Edit the full prose content, intro paragraphs with drop caps, technical body sections, pull quotes, code blocks, and conclusion.
                        </p>
                      </div>
                      <span className="text-[11px] font-mono text-muted bg-sunken px-2.5 py-1 rounded-full border border-line">
                        {(b.content?.intro?.length || 0)} intro · {(b.content?.sections?.length || 0)} sections
                      </span>
                    </div>

                    {/* 1. OPENING / INTRO PARAGRAPHS */}
                    <div className="rounded-xl border border-line bg-sunken/30 p-4 space-y-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <label className="text-xs uppercase font-medium text-foreground tracking-wider">
                            Opening Intro Paragraphs
                          </label>
                          <p className="text-[11px] text-muted">
                            First paragraph automatically features an editorial drop cap on the essay page.
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            const blogs = [...data.blogs];
                            if (!blogs[i].content) blogs[i].content = { intro: [], sections: [], conclusion: "" };
                            if (!blogs[i].content.intro) blogs[i].content.intro = [];
                            blogs[i].content.intro.push("");
                            setData({ ...data, blogs });
                          }}
                          className="btn-secondary !py-1 !px-2.5 !text-xs inline-flex items-center gap-1 text-accent-strong hover:border-accent"
                        >
                          <Plus size={12} /> Add Intro Paragraph
                        </button>
                      </div>

                      <div className="space-y-2">
                        {(b.content?.intro || []).map((p: string, pIdx: number) => (
                          <div key={pIdx} className="flex gap-2 items-start">
                            <span className="text-[11px] font-mono text-muted pt-2 w-6 text-right shrink-0">
                              #{pIdx + 1}
                            </span>
                            <textarea
                              rows={2}
                              value={p}
                              onChange={(e) => {
                                const blogs = [...data.blogs];
                                blogs[i].content.intro[pIdx] = e.target.value;
                                setData({ ...data, blogs });
                              }}
                              placeholder={`Intro paragraph ${pIdx + 1}...`}
                              className="field text-sm leading-relaxed flex-1 font-serif !py-2"
                            />
                            <button
                              type="button"
                              onClick={() => {
                                const blogs = [...data.blogs];
                                blogs[i].content.intro = blogs[i].content.intro.filter((_: any, idx: number) => idx !== pIdx);
                                setData({ ...data, blogs });
                              }}
                              className="p-1.5 text-muted hover:text-red-500 shrink-0 mt-1"
                              title="Delete intro paragraph"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        ))}
                        {(!b.content?.intro || b.content.intro.length === 0) && (
                          <p className="text-xs italic text-muted text-center py-2">
                            No intro paragraphs yet. Click &ldquo;Add Intro Paragraph&rdquo; to start.
                          </p>
                        )}
                      </div>
                    </div>

                    {/* 2. BODY SECTIONS */}
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <label className="text-xs uppercase font-medium text-foreground tracking-wider">
                            Article Body Sections
                          </label>
                          <p className="text-[11px] text-muted">
                            Each section includes a major heading, paragraphs, an optional large pull quote, and an optional code snippet.
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            const blogs = [...data.blogs];
                            if (!blogs[i].content) blogs[i].content = { intro: [], sections: [], conclusion: "" };
                            if (!blogs[i].content.sections) blogs[i].content.sections = [];
                            blogs[i].content.sections.push({
                              heading: `${blogs[i].content.sections.length + 1}. New Section Heading`,
                              paragraphs: [""],
                              quote: "",
                              code: null,
                            });
                            setData({ ...data, blogs });
                          }}
                          className="btn-primary !py-1 !px-3 !text-xs inline-flex items-center gap-1.5"
                        >
                          <Plus size={12} /> Add Section
                        </button>
                      </div>

                      <div className="space-y-4">
                        {(b.content?.sections || []).map((sec: any, sIdx: number) => (
                          <div
                            key={sIdx}
                            className="rounded-xl border border-line bg-surface/80 p-4 space-y-4 shadow-sm"
                          >
                            {/* Section Header: Heading & Actions */}
                            <div className="flex items-center justify-between gap-3 border-b border-line/60 pb-3">
                              <div className="flex-1 flex items-center gap-2">
                                <span className="rounded bg-accent/10 px-2 py-0.5 text-[10px] font-mono font-medium text-accent-strong shrink-0">
                                  Section {sIdx + 1}
                                </span>
                                <input
                                  value={sec.heading || ""}
                                  onChange={(e) => {
                                    const blogs = [...data.blogs];
                                    blogs[i].content.sections[sIdx].heading = e.target.value;
                                    setData({ ...data, blogs });
                                  }}
                                  placeholder="e.g. 1. The Grammar of Good Architecture"
                                  className="field font-serif text-base font-medium flex-1 !py-1"
                                />
                              </div>
                              <button
                                type="button"
                                onClick={() => {
                                  const blogs = [...data.blogs];
                                  blogs[i].content.sections = blogs[i].content.sections.filter(
                                    (_: any, idx: number) => idx !== sIdx
                                  );
                                  setData({ ...data, blogs });
                                }}
                                className="p-1.5 text-muted hover:text-red-500"
                                title="Delete section"
                              >
                                <Trash2 size={15} />
                              </button>
                            </div>

                            {/* Section Paragraphs */}
                            <div className="space-y-2 pl-2 border-l-2 border-line/60">
                              <div className="flex items-center justify-between">
                                <label className="text-[11px] text-muted uppercase font-medium">
                                  Section Paragraphs
                                </label>
                                <button
                                  type="button"
                                  onClick={() => {
                                    const blogs = [...data.blogs];
                                    if (!blogs[i].content.sections[sIdx].paragraphs) {
                                      blogs[i].content.sections[sIdx].paragraphs = [];
                                    }
                                    blogs[i].content.sections[sIdx].paragraphs.push("");
                                    setData({ ...data, blogs });
                                  }}
                                  className="text-[11px] text-accent hover:underline inline-flex items-center gap-1 font-medium"
                                >
                                  <Plus size={11} /> Add Paragraph
                                </button>
                              </div>

                              {(sec.paragraphs || []).map((par: string, parIdx: number) => (
                                <div key={parIdx} className="flex gap-2 items-start">
                                  <span className="text-[10px] font-mono text-muted pt-2 w-5 text-right shrink-0">
                                    P{parIdx + 1}
                                  </span>
                                  <textarea
                                    rows={2}
                                    value={par}
                                    onChange={(e) => {
                                      const blogs = [...data.blogs];
                                      blogs[i].content.sections[sIdx].paragraphs[parIdx] = e.target.value;
                                      setData({ ...data, blogs });
                                    }}
                                    placeholder={`Paragraph ${parIdx + 1} text...`}
                                    className="field text-sm leading-relaxed flex-1 font-serif !py-1.5"
                                  />
                                  <button
                                    type="button"
                                    onClick={() => {
                                      const blogs = [...data.blogs];
                                      blogs[i].content.sections[sIdx].paragraphs = blogs[i].content.sections[
                                        sIdx
                                      ].paragraphs.filter((_: any, idx: number) => idx !== parIdx);
                                      setData({ ...data, blogs });
                                    }}
                                    className="p-1 text-muted hover:text-red-500 shrink-0 mt-1"
                                    title="Delete paragraph"
                                  >
                                    <Trash2 size={13} />
                                  </button>
                                </div>
                              ))}
                              {(!sec.paragraphs || sec.paragraphs.length === 0) && (
                                <p className="text-xs italic text-muted py-1">No paragraphs in this section.</p>
                              )}
                            </div>

                            {/* Section Quote (Editorial pullquote) */}
                            <div className="space-y-1.5 pl-2 border-l-2 border-accent/40 bg-sunken/20 p-2.5 rounded-r-lg">
                              <div className="flex items-center justify-between">
                                <label className="text-[11px] text-accent-strong uppercase font-medium flex items-center gap-1.5">
                                  <Quote size={12} /> Editorial Pull Quote (Optional)
                                </label>
                                {sec.quote && (
                                  <button
                                    type="button"
                                    onClick={() => {
                                      const blogs = [...data.blogs];
                                      blogs[i].content.sections[sIdx].quote = "";
                                      setData({ ...data, blogs });
                                    }}
                                    className="text-[10px] text-muted hover:text-red-500"
                                  >
                                    Clear quote
                                  </button>
                                )}
                              </div>
                              <input
                                value={sec.quote || ""}
                                onChange={(e) => {
                                  const blogs = [...data.blogs];
                                  blogs[i].content.sections[sIdx].quote = e.target.value;
                                  setData({ ...data, blogs });
                                }}
                                placeholder="e.g. Clear code is not the byproduct of brilliant brevity; it is the deliberate elimination of cognitive burden."
                                className="field italic text-xs font-serif !py-1.5"
                              />
                            </div>

                            {/* Section Code Snippet */}
                            <div className="space-y-2 rounded-lg border border-line bg-sunken/40 p-3">
                              <div className="flex items-center justify-between">
                                <label className="text-[11px] text-muted uppercase font-medium flex items-center gap-1.5">
                                  <Code2 size={12} className="text-accent" /> Technical Code Block (Optional)
                                </label>
                                {sec.code ? (
                                  <button
                                    type="button"
                                    onClick={() => {
                                      const blogs = [...data.blogs];
                                      blogs[i].content.sections[sIdx].code = null;
                                      setData({ ...data, blogs });
                                    }}
                                    className="text-[11px] text-red-500 hover:underline inline-flex items-center gap-1"
                                  >
                                    <Trash2 size={11} /> Remove Code Block
                                  </button>
                                ) : (
                                  <button
                                    type="button"
                                    onClick={() => {
                                      const blogs = [...data.blogs];
                                      blogs[i].content.sections[sIdx].code = {
                                        language: "typescript",
                                        caption: "Code demonstration",
                                        snippet: "// Write your code snippet here\n",
                                      };
                                      setData({ ...data, blogs });
                                    }}
                                    className="text-[11px] text-accent hover:underline inline-flex items-center gap-1 font-medium"
                                  >
                                    <Plus size={11} /> Add Code Block
                                  </button>
                                )}
                              </div>

                              {sec.code && (
                                <div className="space-y-2 pt-1">
                                  <div className="grid gap-2 sm:grid-cols-2">
                                    <div>
                                      <label className="text-[10px] text-muted uppercase">Language</label>
                                      <input
                                        value={sec.code.language || ""}
                                        onChange={(e) => {
                                          const blogs = [...data.blogs];
                                          blogs[i].content.sections[sIdx].code.language = e.target.value;
                                          setData({ ...data, blogs });
                                        }}
                                        placeholder="typescript, python, java, sql, bash"
                                        className="field text-xs font-mono !py-1 mt-0.5"
                                      />
                                    </div>
                                    <div>
                                      <label className="text-[10px] text-muted uppercase">Caption / Label</label>
                                      <input
                                        value={sec.code.caption || ""}
                                        onChange={(e) => {
                                          const blogs = [...data.blogs];
                                          blogs[i].content.sections[sIdx].code.caption = e.target.value;
                                          setData({ ...data, blogs });
                                        }}
                                        placeholder="e.g. Predictable naming vs. mysterious shorthand"
                                        className="field text-xs !py-1 mt-0.5"
                                      />
                                    </div>
                                  </div>
                                  <div>
                                    <label className="text-[10px] text-muted uppercase">Code Snippet</label>
                                    <textarea
                                      rows={5}
                                      value={sec.code.snippet || ""}
                                      onChange={(e) => {
                                        const blogs = [...data.blogs];
                                        blogs[i].content.sections[sIdx].code.snippet = e.target.value;
                                        setData({ ...data, blogs });
                                      }}
                                      placeholder="// Code snippet..."
                                      className="field text-xs font-mono leading-relaxed bg-sunken !p-2.5 mt-0.5"
                                      spellCheck={false}
                                    />
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* 3. CONCLUSION */}
                    <div className="rounded-xl border border-line bg-sunken/30 p-4 space-y-2">
                      <label className="text-xs uppercase font-medium text-foreground tracking-wider flex items-center gap-1.5">
                        <Sparkles size={13} className="text-accent" /> Conclusion & Final Thoughts
                      </label>
                      <p className="text-[11px] text-muted">
                        Rendered in the highlighted editorial summary card at the very end of the essay.
                      </p>
                      <textarea
                        rows={3}
                        value={b.content?.conclusion || ""}
                        onChange={(e) => {
                          const blogs = [...data.blogs];
                          if (!blogs[i].content) blogs[i].content = { intro: [], sections: [], conclusion: "" };
                          blogs[i].content.conclusion = e.target.value;
                          setData({ ...data, blogs });
                        }}
                        placeholder="Final thoughts and takeaway reflections..."
                        className="field font-serif text-sm leading-relaxed mt-1"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ==================== TAB: BUCKETS & MEDIA ==================== */}
        {activeTab === "buckets" && (
          <div className="space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-line pb-4">
              <div>
                <h2 className="font-serif text-2xl tracking-tight">Media & Storage Buckets</h2>
                <p className="text-xs text-muted">Upload and manage PDFs, resumes, avatars, and blog illustrations</p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={loadBucketFiles}
                  disabled={bucketLoading}
                  className="btn-secondary !py-1.5 !px-3 !text-xs flex items-center gap-1.5"
                >
                  <RefreshCw size={13} className={bucketLoading ? "animate-spin" : ""} />
                  <span>Refresh</span>
                </button>
                <label className="btn-primary !py-1.5 !px-3.5 !text-xs cursor-pointer inline-flex items-center gap-1.5">
                  {uploadingTarget === "bucket-general" ? (
                    <Loader2 size={13} className="animate-spin" />
                  ) : (
                    <Upload size={13} />
                  )}
                  <span>Upload File</span>
                  <input
                    type="file"
                    accept="image/*,application/pdf,.pdf"
                    className="hidden"
                    disabled={uploadingTarget === "bucket-general"}
                    onChange={async (e) => {
                      const file = e.target.files?.[0];
                      if (!file) return;
                      setUploadingTarget("bucket-general");
                      const isPdf = file.name.toLowerCase().endsWith(".pdf");
                      await uploadFile(file, isPdf ? "resumes" : "portfolio-assets");
                      setUploadingTarget(null);
                    }}
                  />
                </label>
              </div>
            </div>

            {/* Storage Buckets Information Cards */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <div className="rounded-2xl border border-line bg-surface p-4 shadow-sm flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent/10 text-accent">
                  <FileText size={20} />
                </div>
                <div>
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-muted">Bucket 1</h4>
                  <p className="font-serif text-base text-ink">resumes</p>
                  <p className="text-[11px] text-muted">PDFs, Curriculum Vitae, Diplomas</p>
                </div>
              </div>
              <div className="rounded-2xl border border-line bg-surface p-4 shadow-sm flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent/10 text-accent">
                  <ImageIcon size={20} />
                </div>
                <div>
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-muted">Bucket 2</h4>
                  <p className="font-serif text-base text-ink">portfolio-assets</p>
                  <p className="text-[11px] text-muted">Portraits, blog covers, project banners</p>
                </div>
              </div>
              <div className="rounded-2xl border border-line bg-surface p-4 shadow-sm flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent/10 text-accent">
                  <FolderUp size={20} />
                </div>
                <div>
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-muted">Total Stored</h4>
                  <p className="font-serif text-base text-ink">{bucketFiles.length} files</p>
                  <p className="text-[11px] text-muted">Local & Supabase synchronized</p>
                </div>
              </div>
            </div>

            {/* Uploaded Files Grid */}
            {bucketLoading ? (
              <div className="rounded-2xl border border-line bg-surface p-12 text-center text-muted">
                <Loader2 size={24} className="animate-spin mx-auto mb-2 text-accent" />
                <p className="text-xs">Loading bucket storage...</p>
              </div>
            ) : bucketFiles.length === 0 ? (
              <div className="rounded-2xl border border-line bg-surface p-12 text-center text-muted">
                <FolderUp size={36} className="mx-auto mb-3 opacity-40 text-accent" />
                <p className="font-serif text-lg text-ink">No uploaded files yet</p>
                <p className="text-xs text-muted mt-1 max-w-sm mx-auto">
                  Click the Upload File button above to add PDFs or images. They will be saved to your bucket and available with live URLs.
                </p>
              </div>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {bucketFiles.map((file) => (
                  <div
                    key={file.name}
                    className="group rounded-2xl border border-line bg-surface p-4 shadow-sm transition-all hover:shadow-lift flex flex-col justify-between space-y-3"
                  >
                    <div>
                      {file.isImage ? (
                        <div className="relative mb-3 h-36 w-full overflow-hidden rounded-xl border border-line bg-sunken">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={file.url}
                            alt={file.name}
                            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                          />
                        </div>
                      ) : (
                        <div className="mb-3 flex h-36 w-full flex-col items-center justify-center rounded-xl border border-line bg-sunken/60 text-muted">
                          <FileText size={40} className="text-accent mb-2" />
                          <span className="font-mono text-xs font-medium text-ink">PDF Document</span>
                        </div>
                      )}

                      <h4 className="font-mono text-xs font-medium truncate text-ink" title={file.name}>
                        {file.name}
                      </h4>
                      <p className="text-[11px] text-muted mt-0.5">
                        {(file.size / 1024).toFixed(1)} KB · {new Date(file.updatedAt).toLocaleDateString()}
                      </p>
                    </div>

                    <div className="flex items-center justify-between border-t border-line/60 pt-3 gap-2">
                      <button
                        type="button"
                        onClick={() => copyToClipboard(file.url)}
                        className="btn-secondary !py-1 !px-2.5 !text-xs flex items-center gap-1.5"
                        title="Copy relative URL"
                      >
                        {copiedUrl === file.url ? (
                          <>
                            <Check size={12} className="text-emerald-600" />
                            <span className="text-emerald-600 font-medium">Copied!</span>
                          </>
                        ) : (
                          <>
                            <Copy size={12} />
                            <span>Copy URL</span>
                          </>
                        )}
                      </button>

                      <div className="flex items-center gap-1.5">
                        <a
                          href={file.url}
                          target="_blank"
                          rel="noreferrer"
                          className="btn-secondary !py-1 !px-2 !text-xs text-muted hover:text-ink"
                          title="Open in new tab"
                        >
                          <ExternalLink size={12} />
                        </a>
                        <button
                          type="button"
                          onClick={() => deleteBucketFile(file.name)}
                          className="btn-secondary !py-1 !px-2 !text-xs text-muted hover:text-red-500"
                          title="Delete file"
                        >
                          <Trash2 size={12} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ==================== TAB: MESSAGES ==================== */}
        {activeTab === "messages" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between border-b border-line pb-4">
              <div>
                <h2 className="font-serif text-2xl tracking-tight">Contact Inquiries</h2>
                <p className="text-xs text-muted">Submissions received via portfolio contact form</p>
              </div>
              <button
                type="button"
                onClick={loadMessages}
                disabled={messagesLoading}
                className="btn-secondary !py-1.5 !px-3 !text-xs inline-flex items-center gap-1.5"
              >
                <RefreshCw size={13} className={messagesLoading ? "animate-spin" : ""} />
                Refresh
              </button>
            </div>

            {messagesError && (
              <div className="flex items-center gap-2 rounded-xl border border-red-300/60 bg-red-50/60 px-4 py-3 text-sm text-red-700 dark:bg-red-950/30 dark:text-red-300">
                <AlertCircle size={15} /> {messagesError}
              </div>
            )}

            {messages.length === 0 ? (
              <div className="rounded-2xl border border-line bg-surface p-12 text-center text-muted">
                <MessageSquare size={32} className="mx-auto mb-3 opacity-40" />
                <p className="text-sm">No contact messages received yet.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {messages.map((m: any, i: number) => (
                  <div
                    key={m.id || i}
                    className="rounded-2xl border border-line bg-surface p-5 shadow-sm space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-serif text-base font-medium text-ink">{m.name}</h4>
                        <a
                          href={`mailto:${m.email}`}
                          className="text-xs text-accent hover:underline"
                        >
                          {m.email}
                        </a>
                      </div>
                      <span className="text-xs text-muted">
                        {m.created_at ? new Date(m.created_at).toLocaleString() : ""}
                      </span>
                    </div>
                    <p className="text-sm text-ink/90 whitespace-pre-wrap bg-sunken/40 p-3 rounded-xl border border-line/60">
                      {m.message}
                    </p>
                    <div className="flex justify-end gap-2 pt-1">
                      <a
                        href={`mailto:${m.email}?subject=Reply to your inquiry`}
                        className="btn-primary !py-1 !px-2.5 !text-xs"
                      >
                        Reply via Email
                      </a>
                      <button
                        type="button"
                        onClick={() => removeMessage(m.id)}
                        className="btn-secondary !py-1 !px-2.5 !text-xs text-muted hover:text-red-500"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ==================== TAB: DATABASE & SUPABASE ==================== */}
        {activeTab === "database" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between border-b border-line pb-4">
              <div>
                <h2 className="font-serif text-2xl tracking-tight">Supabase & Database Settings</h2>
                <p className="text-xs text-muted">Connect your PostgreSQL instance and sync portfolio data</p>
              </div>
            </div>

            <div className="rounded-2xl border border-line bg-surface p-6 shadow-sm space-y-5">
              <div>
                <h3 className="font-serif text-lg font-medium">Supabase Connection URI</h3>
                <p className="mt-1 text-xs text-muted leading-relaxed">
                  Enter your Supabase PostgreSQL connection string with password{" "}
                  <code className="bg-sunken px-1.5 py-0.5 rounded font-mono text-accent">02b4wuneDf8sSuAf</code>.
                  Example:{" "}
                  <code className="text-[11px] block mt-1 font-mono bg-sunken p-2 rounded border border-line">
                    postgresql://postgres.[PROJECT_REF]:02b4wuneDf8sSuAf@aws-0-[REGION].pooler.supabase.com:6543/postgres
                  </code>
                </p>
              </div>

              <div>
                <label className="mb-1 block text-xs text-muted uppercase">Connection String</label>
                <input
                  type="text"
                  value={dbUri}
                  onChange={(e) => setDbUri(e.target.value)}
                  placeholder="postgresql://postgres.xxx:02b4wuneDf8sSuAf@...pooler.supabase.com:6543/postgres"
                  className="field font-mono text-xs"
                />
              </div>

              <div className="flex flex-wrap gap-3 pt-2">
                <button
                  type="button"
                  onClick={handleTestDb}
                  disabled={dbLoading || !dbUri}
                  className="btn-secondary !py-2 !px-4 !text-xs"
                >
                  {dbLoading ? <Loader2 size={13} className="animate-spin" /> : <RefreshCw size={13} />}
                  <span>Test Connection</span>
                </button>
                <button
                  type="button"
                  onClick={handleSyncDb}
                  disabled={dbLoading || !dbUri}
                  className="btn-primary !py-2 !px-4 !text-xs"
                >
                  <Database size={13} />
                  <span>Migrate & Sync All Data to Supabase</span>
                </button>
              </div>

              {dbStatus && (
                <div
                  className={`mt-4 rounded-xl border p-3.5 text-xs ${
                    dbStatus.includes("success") || dbStatus.includes("Connected")
                      ? "border-emerald-200 bg-emerald-50 text-emerald-800 dark:border-emerald-900/40 dark:bg-emerald-950/40 dark:text-emerald-300"
                      : "border-red-200 bg-red-50 text-red-800 dark:border-red-900/40 dark:bg-red-950/40 dark:text-red-300"
                  }`}
                >
                  {dbStatus}
                </div>
              )}
            </div>

            <div className="rounded-2xl border border-line bg-surface p-6 shadow-sm space-y-4">
              <h3 className="font-serif text-lg font-medium">Automatic Fallback & Persistence</h3>
              <p className="text-xs text-muted leading-relaxed">
                Even without an external database configured, all changes made via this studio are automatically
                stored with zero data loss in <code className="bg-sunken px-1.5 py-0.5 rounded font-mono">data/portfolio.json</code>.
                When you click <strong>Migrate & Sync All Data to Supabase</strong>, the entire database schema and all portfolio records
                are automatically created and loaded into your Supabase database.
              </p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

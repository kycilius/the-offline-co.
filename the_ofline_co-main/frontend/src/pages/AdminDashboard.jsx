import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { LogOut, Plus, Trash2, Calendar as CalendarIcon, RefreshCw, ArrowUpRight } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/lib/auth";
import { api, formatApiError } from "@/lib/api";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuLabel, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from "@/components/ui/dialog";
import { format } from "date-fns";

const STATUS_COLORS = {
  pending: "bg-paper/10 text-paper/80 border-paper/20",
  selected: "bg-ember/20 text-ember border-ember/40",
  waitlisted: "bg-paper/10 text-paper/60 border-paper/20",
  rejected: "bg-paper/5 text-paper/40 border-paper/10",
};

export default function AdminDashboard() {
  const { admin, checking, logout } = useAuth();
  const nav = useNavigate();

  useEffect(() => {
    if (!checking && !admin) nav("/admin/login", { replace: true });
  }, [checking, admin, nav]);

  if (checking || !admin) {
    return <div className="min-h-screen flex items-center justify-center text-paper/40">Loading…</div>;
  }

  return (
    <div className="min-h-screen bg-ink-soft" data-testid="admin-dashboard">
      <header className="border-b border-paper/10 bg-ink/95 sticky top-0 z-30">
        <div className="container-page py-5 flex items-center justify-between">
          <Link to="/" className="font-serif text-xl text-paper">The Ofline Co. — Studio</Link>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="ghost-button" data-testid="admin-menu-trigger">{admin.email}</button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bg-ink-soft border-paper/10 text-paper">
              <DropdownMenuLabel>Signed in as</DropdownMenuLabel>
              <DropdownMenuItem disabled className="text-paper/60">{admin.email}</DropdownMenuItem>
              <DropdownMenuSeparator className="bg-paper/10" />
              <DropdownMenuItem asChild><Link to="/" className="cursor-pointer">View site <ArrowUpRight size={14} className="ml-auto" /></Link></DropdownMenuItem>
              <DropdownMenuItem onClick={() => { logout(); nav("/admin/login"); }} data-testid="admin-logout">
                <LogOut size={14} className="mr-2" /> Sign out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>

      <div className="container-page py-10">
        <Tabs defaultValue="applications">
          <TabsList className="bg-ink-soft border border-paper/10 rounded-none">
            <TabsTrigger value="applications" data-testid="tab-applications" className="rounded-none data-[state=active]:bg-ember data-[state=active]:text-ink">Applications</TabsTrigger>
            <TabsTrigger value="experiences"  data-testid="tab-experiences"  className="rounded-none data-[state=active]:bg-ember data-[state=active]:text-ink">Experiences</TabsTrigger>
            <TabsTrigger value="countdown"    data-testid="tab-countdown"    className="rounded-none data-[state=active]:bg-ember data-[state=active]:text-ink">Countdown</TabsTrigger>
            <TabsTrigger value="testimonials" data-testid="tab-testimonials" className="rounded-none data-[state=active]:bg-ember data-[state=active]:text-ink">Testimonials</TabsTrigger>
          </TabsList>

          <TabsContent value="applications" className="mt-8"><ApplicationsPanel /></TabsContent>
          <TabsContent value="experiences" className="mt-8"><ExperiencesPanel /></TabsContent>
          <TabsContent value="countdown" className="mt-8"><CountdownPanel /></TabsContent>
          <TabsContent value="testimonials" className="mt-8"><TestimonialsPanel /></TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

function ApplicationsPanel() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    try {
      const { data } = await api.get("/admin/applications");
      setItems(data);
    } catch (e) { toast.error(formatApiError(e)); }
    finally { setLoading(false); }
  };
  useEffect(() => { load(); }, []);

  const setStatus = async (id, status) => {
    try {
      await api.patch(`/admin/applications/${id}`, { status });
      toast.success(`Marked ${status}`);
      load();
    } catch (e) { toast.error(formatApiError(e)); }
  };
  const remove = async (id) => {
    if (!window.confirm("Delete this application?")) return;
    try {
      await api.delete(`/admin/applications/${id}`);
      load();
    } catch (e) { toast.error(formatApiError(e)); }
  };

  return (
    <section data-testid="applications-panel">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="font-serif text-3xl">Applications</h2>
          <p className="text-paper/55 text-sm mt-1">{items.length} total · {items.filter(i => i.status === "pending").length} pending</p>
        </div>
        <Button variant="outline" onClick={load} className="rounded-none border-paper/20 text-paper hover:bg-paper/5" data-testid="apps-refresh">
          <RefreshCw size={14} className="mr-2" /> Refresh
        </Button>
      </div>
      <div className="border border-paper/10 overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="border-paper/10 hover:bg-transparent">
              <TableHead className="text-paper/60">Alias</TableHead>
              <TableHead className="text-paper/60">Email</TableHead>
              <TableHead className="text-paper/60">City</TableHead>
              <TableHead className="text-paper/60">Why</TableHead>
              <TableHead className="text-paper/60">Status</TableHead>
              <TableHead className="text-paper/60 text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading && <TableRow><TableCell colSpan={6} className="text-paper/40 text-center py-12">Loading…</TableCell></TableRow>}
            {!loading && items.length === 0 && <TableRow><TableCell colSpan={6} className="text-paper/40 text-center py-12">No applications yet.</TableCell></TableRow>}
            {items.map((a) => (
              <TableRow key={a.id} className="border-paper/10 hover:bg-paper/5" data-testid={`app-row-${a.id}`}>
                <TableCell className="font-serif text-paper">{a.alias}</TableCell>
                <TableCell className="text-paper/70">{a.email}</TableCell>
                <TableCell className="text-paper/60">{a.city || "—"}</TableCell>
                <TableCell className="text-paper/70 max-w-xs truncate" title={a.why_offline}>{a.why_offline}</TableCell>
                <TableCell><Badge className={`rounded-none border ${STATUS_COLORS[a.status] || ""}`}>{a.status}</Badge></TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" className="rounded-none text-paper/70 hover:text-paper" data-testid={`app-actions-${a.id}`}>Actions</Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="bg-ink-soft border-paper/10 text-paper rounded-none">
                      <DropdownMenuItem onClick={() => setStatus(a.id, "selected")}>Select</DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setStatus(a.id, "waitlisted")}>Waitlist</DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setStatus(a.id, "rejected")}>Reject</DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setStatus(a.id, "pending")}>Reset to pending</DropdownMenuItem>
                      <DropdownMenuSeparator className="bg-paper/10" />
                      <DropdownMenuItem onClick={() => remove(a.id)} className="text-red-400">Delete</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </section>
  );
}

const BLANK_EXP = {
  slug: "", title: "", region_hint: "", cover_image: "",
  duration: "48 hours", cohort_size: 12, price_inr: 14000,
  summary: "", chapters_text: "", published: true,
};

function ExperiencesPanel() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState(BLANK_EXP);
  const [editId, setEditId] = useState(null);

  const load = async () => {
    setLoading(true);
    try {
      const { data } = await api.get("/admin/experiences");
      setItems(data);
    } catch (e) { toast.error(formatApiError(e)); }
    finally { setLoading(false); }
  };
  useEffect(() => { load(); }, []);

  const startCreate = () => { setEditId(null); setForm(BLANK_EXP); setOpen(true); };
  const startEdit = (e) => {
    setEditId(e.id);
    setForm({ ...e, chapters_text: (e.chapters || []).join("\n") });
    setOpen(true);
  };
  const remove = async (id) => {
    if (!window.confirm("Delete experience?")) return;
    try { await api.delete(`/admin/experiences/${id}`); load(); } catch (er) { toast.error(formatApiError(er)); }
  };
  const save = async () => {
    const payload = {
      slug: form.slug, title: form.title, region_hint: form.region_hint,
      cover_image: form.cover_image, duration: form.duration,
      cohort_size: Number(form.cohort_size), price_inr: Number(form.price_inr),
      summary: form.summary,
      chapters: (form.chapters_text || "").split("\n").map(s => s.trim()).filter(Boolean),
      published: !!form.published,
    };
    try {
      if (editId) {
        await api.patch(`/admin/experiences/${editId}`, payload);
        toast.success("Experience updated");
      } else {
        await api.post("/admin/experiences", payload);
        toast.success("Experience created");
      }
      setOpen(false); load();
    } catch (e) { toast.error(formatApiError(e)); }
  };

  return (
    <section data-testid="experiences-panel">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="font-serif text-3xl">Experiences</h2>
          <p className="text-paper/55 text-sm mt-1">{items.length} total</p>
        </div>
        <Button onClick={startCreate} className="ember-button rounded-none" data-testid="exp-new-btn">
          <Plus size={14} className="mr-2" /> New experience
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {loading && <p className="text-paper/40">Loading…</p>}
        {!loading && items.length === 0 && <p className="text-paper/40">None yet.</p>}
        {items.map((e) => (
          <div key={e.id} className="border border-paper/10 overflow-hidden" data-testid={`exp-row-${e.slug}`}>
            <div className="aspect-[16/9] relative">
              <img src={e.cover_image} alt={e.title} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-ink to-transparent" />
              <div className="absolute bottom-3 left-4 right-4 flex items-end justify-between">
                <div>
                  <p className="overline">{e.region_hint}</p>
                  <h3 className="font-serif text-2xl text-paper">{e.title}</h3>
                </div>
                <Badge className="rounded-none border bg-paper/5 text-paper/70 border-paper/10">{e.published ? "Published" : "Draft"}</Badge>
              </div>
            </div>
            <div className="p-4 flex items-center justify-between text-sm">
              <span className="text-paper/60 font-mono">/{e.slug} · ₹{e.price_inr.toLocaleString("en-IN")}</span>
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm" onClick={() => startEdit(e)} className="rounded-none text-paper/70" data-testid={`exp-edit-${e.slug}`}>Edit</Button>
                <Button variant="ghost" size="sm" onClick={() => remove(e.id)} className="rounded-none text-red-400" data-testid={`exp-delete-${e.slug}`}><Trash2 size={14} /></Button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="bg-ink-soft border-paper/10 text-paper rounded-none max-w-2xl max-h-[90vh] overflow-y-auto" data-testid="exp-dialog">
          <DialogHeader>
            <DialogTitle className="font-serif text-2xl">{editId ? "Edit experience" : "New experience"}</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <Field label="Slug"><Input data-testid="exp-slug" value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} className="rounded-none bg-ink border-paper/15 text-paper" placeholder="shantiniketan-mati" /></Field>
            <Field label="Title"><Input data-testid="exp-title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="rounded-none bg-ink border-paper/15 text-paper" /></Field>
            <Field label="Region hint" full><Input value={form.region_hint} onChange={(e) => setForm({ ...form, region_hint: e.target.value })} className="rounded-none bg-ink border-paper/15 text-paper" /></Field>
            <Field label="Cover image URL" full><Input value={form.cover_image} onChange={(e) => setForm({ ...form, cover_image: e.target.value })} className="rounded-none bg-ink border-paper/15 text-paper" /></Field>
            <Field label="Duration"><Input value={form.duration} onChange={(e) => setForm({ ...form, duration: e.target.value })} className="rounded-none bg-ink border-paper/15 text-paper" /></Field>
            <Field label="Cohort size"><Input type="number" value={form.cohort_size} onChange={(e) => setForm({ ...form, cohort_size: e.target.value })} className="rounded-none bg-ink border-paper/15 text-paper" /></Field>
            <Field label="Price (INR)"><Input type="number" value={form.price_inr} onChange={(e) => setForm({ ...form, price_inr: e.target.value })} className="rounded-none bg-ink border-paper/15 text-paper" /></Field>
            <Field label="Published"><div className="flex items-center gap-3 pt-2">
              <input type="checkbox" checked={!!form.published} onChange={(e) => setForm({ ...form, published: e.target.checked })} className="accent-ember w-4 h-4" />
              <span className="text-paper/70 text-sm">{form.published ? "Visible on site" : "Draft"}</span>
            </div></Field>
            <Field label="Summary" full><Textarea value={form.summary} onChange={(e) => setForm({ ...form, summary: e.target.value })} className="rounded-none bg-ink border-paper/15 text-paper" rows={3} /></Field>
            <Field label="Chapters (one per line)" full><Textarea value={form.chapters_text} onChange={(e) => setForm({ ...form, chapters_text: e.target.value })} className="rounded-none bg-ink border-paper/15 text-paper" rows={5} /></Field>
          </div>
          <DialogFooter className="mt-6">
            <Button variant="outline" onClick={() => setOpen(false)} className="rounded-none border-paper/20 text-paper hover:bg-paper/5">Cancel</Button>
            <Button onClick={save} className="ember-button rounded-none" data-testid="exp-save">{editId ? "Save changes" : "Create"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </section>
  );
}

function Field({ label, full, children }) {
  return (
    <div className={full ? "md:col-span-2" : ""}>
      <Label className="editorial-label">{label}</Label>
      <div className="mt-2">{children}</div>
    </div>
  );
}

function CountdownPanel() {
  const [data, setData] = useState(null);
  const [date, setDate] = useState(null);
  const [time, setTime] = useState("18:00");
  const [seats, setSeats] = useState(12);
  const [label, setLabel] = useState("Location revealed 24h before");

  const load = async () => {
    try {
      const { data: c } = await api.get("/countdown");
      setData(c);
      const d = new Date(c.next_reveal_at);
      setDate(d);
      setTime(`${String(d.getHours()).padStart(2,"0")}:${String(d.getMinutes()).padStart(2,"0")}`);
      setSeats(c.seats_remaining);
      setLabel(c.location_label);
    } catch (e) { toast.error(formatApiError(e)); }
  };
  useEffect(() => { load(); }, []);

  const save = async () => {
    if (!date) return toast.error("Pick a date");
    const [hh, mm] = time.split(":").map(Number);
    const target = new Date(date);
    target.setHours(hh || 0, mm || 0, 0, 0);
    try {
      await api.put("/admin/countdown", {
        next_reveal_at: target.toISOString(),
        location_label: label,
        seats_remaining: Number(seats),
      });
      toast.success("Countdown updated");
      load();
    } catch (e) { toast.error(formatApiError(e)); }
  };

  return (
    <section data-testid="countdown-panel" className="grid grid-cols-1 md:grid-cols-12 gap-10">
      <div className="md:col-span-5">
        <h2 className="font-serif text-3xl">Countdown</h2>
        <p className="text-paper/55 text-sm mt-2">Sets the timer that visitors see on the homepage.</p>
        {data && (
          <div className="mt-6 border border-paper/10 p-4">
            <p className="overline mb-2">Currently set to</p>
            <p className="num-display text-2xl text-paper">{format(new Date(data.next_reveal_at), "EEE, dd MMM yyyy · HH:mm")}</p>
            <p className="text-paper/55 text-sm mt-2">{data.location_label}</p>
            <p className="text-paper/55 text-sm">{data.seats_remaining} seats remaining</p>
          </div>
        )}
      </div>
      <div className="md:col-span-7 space-y-6">
        <div>
          <Label className="editorial-label">Reveal date</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="rounded-none mt-2 w-full justify-start border-paper/20 text-paper hover:bg-paper/5" data-testid="countdown-date-trigger">
                <CalendarIcon size={14} className="mr-2" />
                {date ? format(date, "EEE, dd MMM yyyy") : "Pick a date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent align="start" className="bg-ink-soft border-paper/10 rounded-none">
              <Calendar mode="single" selected={date} onSelect={setDate} className="rounded-none" />
            </PopoverContent>
          </Popover>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label className="editorial-label">Time (24h)</Label>
            <Input type="time" value={time} onChange={(e) => setTime(e.target.value)} className="rounded-none mt-2 bg-ink border-paper/15 text-paper" data-testid="countdown-time" />
          </div>
          <div>
            <Label className="editorial-label">Seats remaining</Label>
            <Input type="number" min={0} value={seats} onChange={(e) => setSeats(e.target.value)} className="rounded-none mt-2 bg-ink border-paper/15 text-paper" data-testid="countdown-seats" />
          </div>
        </div>
        <div>
          <Label className="editorial-label">Location label</Label>
          <Input value={label} onChange={(e) => setLabel(e.target.value)} className="rounded-none mt-2 bg-ink border-paper/15 text-paper" data-testid="countdown-label" />
        </div>
        <Button onClick={save} className="ember-button rounded-none" data-testid="countdown-save">Save countdown</Button>
      </div>
    </section>
  );
}

function TestimonialsPanel() {
  const [items, setItems] = useState([]);
  const [quote, setQuote] = useState("");
  const [attribution, setAttribution] = useState("Anonymous participant");

  const load = async () => {
    try {
      const { data } = await api.get("/testimonials");
      setItems(data);
    } catch (e) { toast.error(formatApiError(e)); }
  };
  useEffect(() => { load(); }, []);

  const add = async () => {
    if (!quote.trim()) return;
    try {
      await api.post("/admin/testimonials", { quote, attribution });
      setQuote(""); load();
      toast.success("Added");
    } catch (e) { toast.error(formatApiError(e)); }
  };
  const remove = async (id) => {
    try { await api.delete(`/admin/testimonials/${id}`); load(); } catch (e) { toast.error(formatApiError(e)); }
  };

  return (
    <section data-testid="testimonials-panel" className="grid grid-cols-1 md:grid-cols-12 gap-10">
      <div className="md:col-span-5">
        <h2 className="font-serif text-3xl">Testimonials</h2>
        <div className="mt-6 space-y-4">
          <Textarea value={quote} onChange={(e) => setQuote(e.target.value)} placeholder="The quote (no avatars, no names by default)" rows={4} className="rounded-none bg-ink border-paper/15 text-paper" data-testid="testimonial-quote" />
          <Input value={attribution} onChange={(e) => setAttribution(e.target.value)} placeholder="Attribution (e.g., Founder, 34)" className="rounded-none bg-ink border-paper/15 text-paper" data-testid="testimonial-attribution" />
          <Button onClick={add} className="ember-button rounded-none" data-testid="testimonial-add"><Plus size={14} className="mr-2" /> Add</Button>
        </div>
      </div>
      <div className="md:col-span-7 space-y-4">
        {items.length === 0 && <p className="text-paper/40">None yet.</p>}
        {items.map((t) => (
          <div key={t.id} className="border border-paper/10 p-5 flex items-start gap-4" data-testid={`testimonial-${t.id}`}>
            <div className="flex-1">
              <p className="font-serif italic text-paper text-lg">"{t.quote}"</p>
              <p className="mt-2 text-xs tracking-[0.22em] uppercase text-paper/45">— {t.attribution}</p>
            </div>
            <Button variant="ghost" size="sm" onClick={() => remove(t.id)} className="rounded-none text-red-400"><Trash2 size={14} /></Button>
          </div>
        ))}
      </div>
    </section>
  );
}

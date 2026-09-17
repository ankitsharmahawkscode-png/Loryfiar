import React, { useEffect, useState, useCallback } from "react";
import "./admin.css";
import AdminLogin from "./AdminLogin";
import AdminIssues from "./AdminIssues";
import AdminPosts from "./AdminPosts";
import {
  fetchAdminInterviews,
  createInterview,
  updateInterview,
  deleteInterview,
  getAdminToken,
  clearAdminToken,
} from "../api";

const emptyForm = {
  title: "",
  founder: "",
  avatar: "",
  outcome: "success",
  category: "",
  country: "",
  revenue: "",
  causeOfFailure: "",
  date: new Date().toISOString().slice(0, 10),
  published: true,
  excerpt: "",
  body: "",
};

function formatDate(iso) {
  return new Date(iso).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

const AdminDashboard = () => {
  const [authed, setAuthed] = useState(!!getAdminToken());
  const [tab, setTab] = useState("interviews"); // "interviews" | "issues"
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [showForm, setShowForm] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const data = await fetchAdminInterviews();
      setRows(data.results);
    } catch (e) {
      if (e.message === "UNAUTHORIZED") {
        clearAdminToken();
        setAuthed(false);
      } else {
        setError("Couldn't reach the API. Is the server running?");
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (authed) load();
  }, [authed, load]);

  const startCreate = () => {
    setEditingId(null);
    setForm(emptyForm);
    setShowForm(true);
  };

  const startEdit = (row) => {
    setEditingId(row.id);
    setForm({
      title: row.title,
      founder: row.founder,
      avatar: row.avatar || "",
      outcome: row.outcome,
      category: row.category,
      country: row.country,
      revenue: row.revenue,
      causeOfFailure: row.causeOfFailure,
      date: row.date.slice(0, 10),
      published: row.published,
      excerpt: row.excerpt || "",
      body: row.body || "",
    });
    setShowForm(true);
  };

  const cancelForm = () => {
    setShowForm(false);
    setEditingId(null);
    setForm(emptyForm);
  };

  const submitForm = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      if (editingId) {
        await updateInterview(editingId, form);
      } else {
        await createInterview(form);
      }
      cancelForm();
      await load();
    } catch (e2) {
      if (e2.message === "UNAUTHORIZED") {
        clearAdminToken();
        setAuthed(false);
      } else {
        setError("Save failed. Check the fields and try again.");
      }
    } finally {
      setSaving(false);
    }
  };

  const remove = async (row) => {
    if (!window.confirm(`Delete "${row.title}"? This can't be undone.`)) return;
    try {
      await deleteInterview(row.id);
      await load();
    } catch (e) {
      if (e.message === "UNAUTHORIZED") {
        clearAdminToken();
        setAuthed(false);
      } else {
        setError("Delete failed.");
      }
    }
  };

  const togglePublished = async (row) => {
    try {
      await updateInterview(row.id, { published: !row.published });
      await load();
    } catch (e) {
      if (e.message === "UNAUTHORIZED") {
        clearAdminToken();
        setAuthed(false);
      }
    }
  };

  const logout = () => {
    clearAdminToken();
    setAuthed(false);
  };

  if (!authed) {
    return <AdminLogin onLoggedIn={() => setAuthed(true)} />;
  }

  return (
    <main className="admin-page">
      <div className="admin-header">
        <div>
          <p className="admin-kicker">Loryfiar</p>
          <h1>Admin</h1>
        </div>
        <div className="admin-header-actions">
          <button className="btn-secondary" onClick={logout}>
            Log out
          </button>
        </div>
      </div>

      <div className="admin-tabs">
        <button
          type="button"
          className={`admin-tab ${tab === "interviews" ? "active" : ""}`}
          onClick={() => setTab("interviews")}
        >
          Interviews
        </button>
        <button
          type="button"
          className={`admin-tab ${tab === "issues" ? "active" : ""}`}
          onClick={() => setTab("issues")}
        >
          Latest Issues
        </button>
        <button
          type="button"
          className={`admin-tab ${tab === "posts" ? "active" : ""}`}
          onClick={() => setTab("posts")}
        >
          Blog
        </button>
      </div>

      {tab === "issues" ? (
        <AdminIssues onUnauthorized={() => setAuthed(false)} />
      ) : tab === "posts" ? (
        <AdminPosts onUnauthorized={() => setAuthed(false)} />
      ) : (
        <InterviewsAdminSection
          rows={rows}
          loading={loading}
          error={error}
          showForm={showForm}
          form={form}
          setForm={setForm}
          editingId={editingId}
          saving={saving}
          startCreate={startCreate}
          startEdit={startEdit}
          cancelForm={cancelForm}
          submitForm={submitForm}
          remove={remove}
          togglePublished={togglePublished}
        />
      )}
    </main>
  );
};

const InterviewsAdminSection = ({
  rows,
  loading,
  error,
  showForm,
  form,
  setForm,
  editingId,
  saving,
  startCreate,
  startEdit,
  cancelForm,
  submitForm,
  remove,
  togglePublished,
}) => {
  return (
    <>
      <div className="admin-subheader">
        <h2>Interviews</h2>
        <button className="btn-primary" onClick={startCreate}>
          + New interview
        </button>
      </div>

      {error && <p className="admin-error">{error}</p>}

      {showForm && (
        <div className="admin-modal-backdrop" onClick={cancelForm}>
          <form
            className="admin-form"
            onClick={(e) => e.stopPropagation()}
            onSubmit={submitForm}
          >
            <h2>{editingId ? "Edit interview" : "New interview"}</h2>

            <label>
              Title
              <input
                required
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
              />
            </label>

            <label>
              Founder name
              <input
                required
                value={form.founder}
                onChange={(e) => setForm({ ...form, founder: e.target.value })}
              />
            </label>

            <label>
              Photo
              <div className="avatar-input-row">
                {form.avatar && (
                  <img
                    src={form.avatar}
                    alt="Preview"
                    className="avatar-preview"
                  />
                )}
                <input
                  type="file"
                  accept="image/png, image/jpeg, image/webp"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (!file) return;
                    const reader = new FileReader();
                    reader.onload = () =>
                      setForm((f) => ({ ...f, avatar: reader.result }));
                    reader.readAsDataURL(file);
                  }}
                />
              </div>
              <input
                type="url"
                placeholder="…or paste an image URL"
                value={form.avatar.startsWith("data:") ? "" : form.avatar}
                onChange={(e) => setForm({ ...form, avatar: e.target.value })}
              />
            </label>

            <div className="admin-form-row">
              <label>
                Outcome
                <select
                  value={form.outcome}
                  onChange={(e) => setForm({ ...form, outcome: e.target.value })}
                >
                  <option value="success">Successful startup</option>
                  <option value="failed">Failed startup</option>
                </select>
              </label>

              <label>
                Date
                <input
                  type="date"
                  value={form.date}
                  onChange={(e) => setForm({ ...form, date: e.target.value })}
                />
              </label>
            </div>

            <div className="admin-form-row">
              <label>
                Category
                <input
                  value={form.category}
                  onChange={(e) => setForm({ ...form, category: e.target.value })}
                  placeholder="Finances, Travel, Services…"
                />
              </label>

              <label>
                Country
                <input
                  value={form.country}
                  onChange={(e) => setForm({ ...form, country: e.target.value })}
                />
              </label>
            </div>

            <div className="admin-form-row">
              <label>
                Revenue
                <input
                  value={form.revenue}
                  onChange={(e) => setForm({ ...form, revenue: e.target.value })}
                  placeholder="$0-$10k/mo"
                />
              </label>

              <label>
                Cause of failure
                <input
                  value={form.causeOfFailure}
                  onChange={(e) =>
                    setForm({ ...form, causeOfFailure: e.target.value })
                  }
                  placeholder="No Market Need…"
                  disabled={form.outcome !== "failed"}
                />
              </label>
            </div>

            <label>
              Excerpt (short summary shown at the top of the article)
              <input
                value={form.excerpt}
                onChange={(e) => setForm({ ...form, excerpt: e.target.value })}
                placeholder="One sentence summarizing the interview"
              />
            </label>

            <label>
              Full interview
              <textarea
                rows={8}
                value={form.body}
                onChange={(e) => setForm({ ...form, body: e.target.value })}
                placeholder="Write the full interview. Leave a blank line between paragraphs."
              />
            </label>

            <label className="admin-checkbox">
              <input
                type="checkbox"
                checked={form.published}
                onChange={(e) =>
                  setForm({ ...form, published: e.target.checked })
                }
              />
              Published (visible on the public Interviews page)
            </label>

            <div className="admin-form-actions">
              <button
                type="button"
                className="btn-secondary"
                onClick={cancelForm}
              >
                Cancel
              </button>
              <button type="submit" className="btn-primary" disabled={saving}>
                {saving ? "Saving…" : editingId ? "Save changes" : "Create"}
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="admin-table">
        <div className="admin-row admin-row-head">
          <span>Title</span>
          <span>Founder</span>
          <span>Outcome</span>
          <span>Date</span>
          <span>Status</span>
          <span></span>
        </div>

        {loading && <p className="admin-status">Loading…</p>}
        {!loading && rows.length === 0 && (
          <p className="admin-status">No interviews yet. Create the first one.</p>
        )}

        {!loading &&
          rows.map((row) => (
            <div key={row.id} className="admin-row">
              <span className="admin-title-cell">{row.title}</span>
              <span>{row.founder}</span>
              <span>
                <span
                  className={`outcome-pill ${
                    row.outcome === "failed" ? "pill-failed" : "pill-success"
                  }`}
                >
                  {row.outcome === "failed" ? "Failed" : "Success"}
                </span>
              </span>
              <span>{formatDate(row.date)}</span>
              <span>
                <button
                  className={`status-toggle ${row.published ? "is-live" : ""}`}
                  onClick={() => togglePublished(row)}
                  type="button"
                >
                  {row.published ? "Published" : "Draft"}
                </button>
              </span>
              <span className="admin-row-actions">
                <button type="button" onClick={() => startEdit(row)}>
                  Edit
                </button>
                <button
                  type="button"
                  className="danger"
                  onClick={() => remove(row)}
                >
                  Delete
                </button>
              </span>
            </div>
          ))}
      </div>
    </>
  );
};

export default AdminDashboard;
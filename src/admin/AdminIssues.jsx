import React, { useEffect, useState, useCallback } from "react";
import {
  fetchAdminIssues,
  createIssue,
  updateIssue,
  deleteIssue,
  clearAdminToken,
} from "../api";

const emptyForm = {
  title: "",
  description: "",
  image: "",
  url: "",
  date: new Date().toISOString().slice(0, 10),
  published: true,
};

function formatDate(iso) {
  return new Date(iso).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

const AdminIssues = ({ onUnauthorized }) => {
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
      const data = await fetchAdminIssues();
      setRows(data.results);
    } catch (e) {
      if (e.message === "UNAUTHORIZED") {
        clearAdminToken();
        onUnauthorized?.();
      } else {
        setError("Couldn't reach the API. Is the server running?");
      }
    } finally {
      setLoading(false);
    }
  }, [onUnauthorized]);

  useEffect(() => {
    load();
  }, [load]);

  const startCreate = () => {
    setEditingId(null);
    setForm(emptyForm);
    setShowForm(true);
  };

  const startEdit = (row) => {
    setEditingId(row.id);
    setForm({
      title: row.title,
      description: row.description || "",
      image: row.image || "",
      url: row.url,
      date: row.date.slice(0, 10),
      published: row.published,
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
        await updateIssue(editingId, form);
      } else {
        await createIssue(form);
      }
      cancelForm();
      await load();
    } catch (e2) {
      if (e2.message === "UNAUTHORIZED") {
        clearAdminToken();
        onUnauthorized?.();
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
      await deleteIssue(row.id);
      await load();
    } catch (e) {
      if (e.message === "UNAUTHORIZED") {
        clearAdminToken();
        onUnauthorized?.();
      } else {
        setError("Delete failed.");
      }
    }
  };

  const togglePublished = async (row) => {
    try {
      await updateIssue(row.id, { published: !row.published });
      await load();
    } catch (e) {
      if (e.message === "UNAUTHORIZED") {
        clearAdminToken();
        onUnauthorized?.();
      }
    }
  };

  return (
    <div>
      <div className="admin-subheader">
        <h2>Latest Issues</h2>
        <button className="btn-primary" onClick={startCreate}>
          + New issue
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
            <h2>{editingId ? "Edit issue" : "New issue"}</h2>

            <label>
              Title
              <input
                required
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                placeholder="The One-Hour Home"
              />
            </label>

            <label>
              Description
              <input
                value={form.description}
                onChange={(e) =>
                  setForm({ ...form, description: e.target.value })
                }
                placeholder="One-line summary shown under the title"
              />
            </label>

            <label>
              Link URL
              <input
                required
                type="url"
                value={form.url}
                onChange={(e) => setForm({ ...form, url: e.target.value })}
                placeholder="https://newsletter.example.com/p/..."
              />
            </label>

            <label>
              Cover image
              <div className="avatar-input-row">
                {form.image && (
                  <img
                    src={form.image}
                    alt="Preview"
                    className="issue-image-preview"
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
                      setForm((f) => ({ ...f, image: reader.result }));
                    reader.readAsDataURL(file);
                  }}
                />
              </div>
              <input
                type="url"
                placeholder="…or paste an image URL"
                value={form.image.startsWith("data:") ? "" : form.image}
                onChange={(e) => setForm({ ...form, image: e.target.value })}
              />
            </label>

            <div className="admin-form-row">
              <label>
                Date
                <input
                  type="date"
                  value={form.date}
                  onChange={(e) => setForm({ ...form, date: e.target.value })}
                />
              </label>
            </div>

            <label className="admin-checkbox">
              <input
                type="checkbox"
                checked={form.published}
                onChange={(e) =>
                  setForm({ ...form, published: e.target.checked })
                }
              />
              Published (visible on the home page)
            </label>

            <div className="admin-form-actions">
              <button type="button" className="btn-secondary" onClick={cancelForm}>
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
        <div className="admin-row admin-row-head admin-row-issues">
          <span>Title</span>
          <span>URL</span>
          <span>Date</span>
          <span>Status</span>
          <span></span>
        </div>

        {loading && <p className="admin-status">Loading…</p>}
        {!loading && rows.length === 0 && (
          <p className="admin-status">No issues yet. Create the first one.</p>
        )}

        {!loading &&
          rows.map((row) => (
            <div key={row.id} className="admin-row admin-row-issues">
              <span className="admin-title-cell">{row.title}</span>
              <span className="admin-url-cell">{row.url}</span>
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
                <button type="button" className="danger" onClick={() => remove(row)}>
                  Delete
                </button>
              </span>
            </div>
          ))}
      </div>
    </div>
  );
};

export default AdminIssues;
import React, { useEffect, useState, useCallback } from "react";
import {
  fetchAdminPosts,
  createPost,
  updatePost,
  deletePost,
  clearAdminToken,
} from "../api";

const emptyForm = {
  title: "",
  tag: "",
  excerpt: "",
  body: "",
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

const AdminPosts = ({ onUnauthorized }) => {
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
      const data = await fetchAdminPosts();
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
      tag: row.tag || "",
      excerpt: row.excerpt || "",
      body: row.body || "",
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
        await updatePost(editingId, form);
      } else {
        await createPost(form);
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
      await deletePost(row.id);
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
      await updatePost(row.id, { published: !row.published });
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
        <h2>Blog posts</h2>
        <button className="btn-primary" onClick={startCreate}>
          + New post
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
            <h2>{editingId ? "Edit post" : "New post"}</h2>

            <label>
              Title
              <input
                required
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
              />
            </label>

            <div className="admin-form-row">
              <label>
                Tag
                <input
                  value={form.tag}
                  onChange={(e) => setForm({ ...form, tag: e.target.value })}
                  placeholder="Essay, Field notes…"
                />
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

            <label>
              Excerpt (shown in the list)
              <input
                value={form.excerpt}
                onChange={(e) => setForm({ ...form, excerpt: e.target.value })}
                placeholder="One or two sentence teaser"
              />
            </label>

            <label>
              Full post
              <textarea
                rows={10}
                value={form.body}
                onChange={(e) => setForm({ ...form, body: e.target.value })}
                placeholder="Write the full post. Leave a blank line between paragraphs."
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
              Published (visible on the public Blog page)
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
        <div className="admin-row admin-row-head admin-row-posts">
          <span>Title</span>
          <span>Tag</span>
          <span>Date</span>
          <span>Status</span>
          <span></span>
        </div>

        {loading && <p className="admin-status">Loading…</p>}
        {!loading && rows.length === 0 && (
          <p className="admin-status">No posts yet. Create the first one.</p>
        )}

        {!loading &&
          rows.map((row) => (
            <div key={row.id} className="admin-row admin-row-posts">
              <span className="admin-title-cell">{row.title}</span>
              <span>{row.tag || "—"}</span>
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

export default AdminPosts;
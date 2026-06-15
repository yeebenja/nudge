import { useState } from "react";

type View = "hers" | "his";

interface Nudge {
  complaint: string;
  suggestion: string;
}

function stripPreamble(text: string): string {
  const bulletIdx = text.search(/[-•]\s/);
  return bulletIdx > 0 ? text.slice(bulletIdx) : text;
}

function App() {
  const [view, setView] = useState<View>("hers");
  const [complaint, setComplaint] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const [nudge, setNudge] = useState<Nudge | null>(null);
  const [loading, setLoading] = useState(false);
  const [fetchError, setFetchError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!complaint.trim()) return;

    setSubmitting(true);
    setSubmitError(null);
    setSubmitSuccess(false);

    try {
      const res = await fetch("/api/nudge", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ complaint: complaint.trim() }),
      });
      if (!res.ok) throw new Error(`Server error: ${res.status}`);
      setSubmitSuccess(true);
      setComplaint("");
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : "Failed to submit");
    } finally {
      setSubmitting(false);
    }
  }

  async function loadLatestNudge() {
    setLoading(true);
    setFetchError(null);

    try {
      const res = await fetch("/api/nudge/latest");
      if (!res.ok) {
        if (res.status === 404) {
          setNudge(null);
          return;
        }
        throw new Error(`Server error: ${res.status}`);
      }
      const data: Nudge = await res.json();
      setNudge(data);
    } catch (err) {
      setFetchError(err instanceof Error ? err.message : "Failed to load");
    } finally {
      setLoading(false);
    }
  }

  function handleViewChange(newView: View) {
    setView(newView);
    if (newView === "his") {
      loadLatestNudge();
    }
  }

  return (
    <div>
      <div>
        <button onClick={() => handleViewChange("hers")}>Her Side</button>
        <button onClick={() => handleViewChange("his")}>His Side</button>
      </div>

      {view === "hers" && (
        <div>
          <h2>Nudge</h2>
          <p>
            Say what's on your mind. Nudge will give him a soft and gentle...
            well, nudge :)
          </p>

          <form onSubmit={handleSubmit}>
            <div>
              <textarea
                rows={6}
                cols={60}
                value={complaint}
                onChange={(e) => setComplaint(e.target.value)}
                placeholder={"Input your complaints here..."}
              />
            </div>
            <button type="submit" disabled={submitting || !complaint.trim()}>
              {submitting ? "Sending..." : "Send Nudge"}
            </button>
          </form>

          {submitSuccess && (
            <p>Nudge sent! Toggle to His Side to see the softened version.</p>
          )}
          {submitError && <p style={{ color: "red" }}>{submitError}</p>}
        </div>
      )}

      {view === "his" && (
        <div>
          <h2>Your Nudges</h2>

          {loading && <p>Loading...</p>}
          {fetchError && <p style={{ color: "red" }}>{fetchError}</p>}

          {!loading && !fetchError && !nudge && (
            <p>No nudges yet. Tell her to write something!</p>
          )}

          {!loading && !fetchError && nudge && (
            <div>
              <h3>Suggestions</h3>
              {stripPreamble(nudge.suggestion)
                .split("\n")
                .filter(Boolean)
                .map((line, i) => (
                  <p key={i}>{line}</p>
                ))}
            </div>
          )}

          <div>
            <button onClick={loadLatestNudge} disabled={loading}>
              Refresh
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;

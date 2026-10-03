import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Star } from "lucide-react";
import { api, formatApiError } from "@/api";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";

export default function Reviews({ productId }) {
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [rating, setRating] = useState(5);
  const [text, setText] = useState("");
  const [sending, setSending] = useState(false);

  const load = () => {
    api(`/reviews?product_id=${productId}`)
      .then(setData)
      .catch(() => setData({ reviews: [], count: 0, average: null }));
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [productId]);

  const submit = async (e) => {
    e.preventDefault();
    setSending(true);
    try {
      await api("/reviews", { method: "POST", body: { product_id: productId, rating, text } });
      setText("");
      toast.success("Merci — votre avis est publié");
      load();
    } catch (err) {
      toast.error(formatApiError(err));
    } finally {
      setSending(false);
    }
  };

  return (
    <div data-testid="reviews-section">
      <div className="flex items-center justify-between gap-4 mb-4">
        <p className="font-tech text-[10px] tracking-[0.35em] text-black/45">
          {data && data.count > 0
            ? `${data.count} AVIS — NOTE MOYENNE ${data.average}/5`
            : "AVIS CLIENTS"}
        </p>
      </div>

      {data && data.count === 0 && (
        <p className="font-tech text-[11px] tracking-[0.1em] text-black/45 py-4">
          Aucun avis pour le moment. Soyez le premier à donner votre avis.
        </p>
      )}

      {data && data.reviews.map((r) => (
        <div key={r.id} className="py-4 border-b border-black/10" data-testid="review-item">
          <div className="flex items-center gap-1">
            {[1, 2, 3, 4, 5].map((s) => (
              <Star
                key={s}
                className={`w-3.5 h-3.5 ${s <= r.rating ? "fill-black text-black" : "text-black/20"}`}
              />
            ))}
            <span className="ml-3 font-tech text-[9px] tracking-[0.25em] text-black/35">
              {new Date(r.created_at).toLocaleDateString("fr-FR")}
            </span>
          </div>
          <p className="font-tech text-[11px] tracking-[0.1em] text-black/70 mt-2">{r.text}</p>
          <p className="font-tech text-[9px] tracking-[0.25em] text-black/35 mt-2">
            {r.author}
          </p>
        </div>
      ))}

      {user ? (
        <form onSubmit={submit} className="mt-6" data-testid="review-form">
          <div className="flex items-center gap-2 mb-3">
            {[1, 2, 3, 4, 5].map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setRating(s)}
                aria-label={`Note ${s}`}
                data-testid={`review-star-${s}`}
                className="cursor-pointer"
              >
                <Star className={`w-5 h-5 ${s <= rating ? "fill-black text-black" : "text-black/25"}`} />
              </button>
            ))}
          </div>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Votre avis…"
            required
            minLength={4}
            data-testid="review-text-input"
            className="w-full border border-black/15 rounded-2xl p-4 font-tech text-[11px] tracking-[0.1em] text-black placeholder:text-black/35 focus:outline-none focus:border-black transition-colors min-h-24"
          />
          <button
            type="submit"
            disabled={sending}
            data-testid="review-submit-button"
            className="mt-3 font-tech text-[10px] tracking-[0.3em] text-white bg-black rounded-full px-7 py-3 hover:bg-black/85 transition-colors cursor-pointer disabled:opacity-50"
          >
            PUBLIER&nbsp;MON&nbsp;AVIS
          </button>
        </form>
      ) : (
        <p className="font-tech text-[10px] tracking-[0.2em] text-black/45 mt-5">
          <Link to="/compte" className="underline underline-offset-4 hover:text-black">
            Connectez-vous
          </Link>{" "}
          pour donner votre avis.
        </p>
      )}
    </div>
  );
}

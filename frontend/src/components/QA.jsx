import { useEffect, useState } from "react";
import { api, formatApiError } from "@/api";
import { toast } from "sonner";

export default function QA({ productId }) {
  const [data, setData] = useState({ questions: [] });
  const [question, setQuestion] = useState("");
  const [email, setEmail] = useState("");
  const [sending, setSending] = useState(false);

  const load = () => {
    api(`/questions?product_id=${productId}`)
      .then(setData)
      .catch(() => setData({ questions: [] }));
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [productId]);

  const submit = async (e) => {
    e.preventDefault();
    setSending(true);
    try {
      await api("/questions", {
        method: "POST",
        body: { product_id: productId, question, email },
      });
      setQuestion("");
      setEmail("");
      toast.success("Question envoyée — réponse à venir");
      load();
    } catch (err) {
      toast.error(formatApiError(err));
    } finally {
      setSending(false);
    }
  };

  return (
    <div data-testid="qa-section">
      <p className="font-tech text-[10px] tracking-[0.35em] text-black/45 mb-4">
        QUESTIONS&nbsp;/&nbsp;RÉPONSES
      </p>

      {data.questions.length === 0 && (
        <p className="font-tech text-[11px] tracking-[0.1em] text-black/45 py-4">
          Aucune question pour le moment. Posez la vôtre ci-dessous.
        </p>
      )}

      {data.questions.map((q) => (
        <div key={q.id} className="py-4 border-b border-black/10" data-testid="qa-item">
          <p className="font-tech text-[11px] tracking-[0.1em] text-black/75">
            {q.question}
          </p>
          <p className="font-tech text-[10px] tracking-[0.15em] text-black/45 mt-2">
            {q.answer ? q.answer : "Réponse à venir — à définir."}
          </p>
          <p className="font-tech text-[9px] tracking-[0.25em] text-black/30 mt-2">
            {new Date(q.created_at).toLocaleDateString("fr-FR")}
          </p>
        </div>
      ))}

      <form onSubmit={submit} className="mt-6" data-testid="qa-form">
        <input
          type="text"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="Votre question…"
          required
          minLength={4}
          data-testid="qa-question-input"
          className="w-full border border-black/15 rounded-full px-5 py-3 font-tech text-[11px] tracking-[0.1em] text-black placeholder:text-black/35 focus:outline-none focus:border-black transition-colors"
        />
        <div className="flex flex-col sm:flex-row gap-3 mt-3">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Votre email (pour la réponse)"
            required
            data-testid="qa-email-input"
            className="flex-1 border border-black/15 rounded-full px-5 py-3 font-tech text-[11px] tracking-[0.1em] text-black placeholder:text-black/35 focus:outline-none focus:border-black transition-colors"
          />
          <button
            type="submit"
            disabled={sending}
            data-testid="qa-submit-button"
            className="font-tech text-[10px] tracking-[0.3em] text-white bg-black rounded-full px-7 py-3 hover:bg-black/85 transition-colors cursor-pointer disabled:opacity-50"
          >
            POSER&nbsp;MA&nbsp;QUESTION
          </button>
        </div>
      </form>
    </div>
  );
}

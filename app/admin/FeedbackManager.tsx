"use client";

import { useState, useTransition } from "react";
import { Trash2, User } from "lucide-react";
import { criarFeedback, removerFeedback } from "./actions";

type Feedback = {
  id: string;
  author_name: string;
  message: string;
  avatar_url: string | null;
};

export default function FeedbackManager({ feedbacks }: { feedbacks: Feedback[] }) {
  const [authorName, setAuthorName] = useState("");
  const [message, setMessage] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [erro, setErro] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleAdicionar() {
    setErro(null);
    startTransition(async () => {
      const result = await criarFeedback({ authorName, message, avatarUrl });
      if (result.error) {
        setErro(result.error);
      } else {
        setAuthorName("");
        setMessage("");
        setAvatarUrl("");
      }
    });
  }

  function handleRemover(id: string) {
    startTransition(() => removerFeedback(id));
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_1fr]">
      <div className="rounded-[1.75rem] border border-stone-200 bg-white/60 p-6">
        <h3 className="font-display text-lg text-wine-900">Novo depoimento</h3>

        <div className="mt-4 flex flex-col gap-3">
          <div>
            <label className="mb-1.5 block font-sans text-sm font-medium text-ink">
              Nome da cliente
            </label>
            <input
              type="text"
              value={authorName}
              onChange={(e) => setAuthorName(e.target.value)}
              className="w-full rounded-xl border border-stone-200 bg-cream px-4 py-2.5 font-sans text-sm text-ink outline-none focus:border-wine-700"
              placeholder="Ex: Marina Souza"
            />
          </div>

          <div>
            <label className="mb-1.5 block font-sans text-sm font-medium text-ink">
              Depoimento
            </label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={3}
              className="w-full rounded-xl border border-stone-200 bg-cream px-4 py-2.5 font-sans text-sm text-ink outline-none focus:border-wine-700"
              placeholder="O que a cliente disse sobre o atendimento"
            />
          </div>

          <div>
            <label className="mb-1.5 block font-sans text-sm font-medium text-ink">
              URL da foto (opcional)
            </label>
            <input
              type="url"
              value={avatarUrl}
              onChange={(e) => setAvatarUrl(e.target.value)}
              className="w-full rounded-xl border border-stone-200 bg-cream px-4 py-2.5 font-sans text-sm text-ink outline-none focus:border-wine-700"
              placeholder="https://..."
            />
            <p className="mt-1.5 font-sans text-xs text-ink-soft">
              Sem URL, aparece um avatar padrão com a inicial do nome.
            </p>
          </div>

          {erro && (
            <p className="rounded-xl bg-red-50 px-4 py-2.5 font-sans text-sm text-red-700">
              {erro}
            </p>
          )}

          <button
            type="button"
            onClick={handleAdicionar}
            disabled={isPending}
            className="mt-1 rounded-full bg-wine-700 px-6 py-3 font-sans text-sm font-semibold text-cream hover:bg-wine-800 disabled:opacity-60"
          >
            Adicionar depoimento
          </button>
        </div>
      </div>

      <div className="rounded-[1.75rem] border border-stone-200 bg-white/60 p-6">
        <h3 className="font-display text-lg text-wine-900">
          Depoimentos publicados {feedbacks.length > 0 && `(${feedbacks.length})`}
        </h3>

        {feedbacks.length === 0 ? (
          <p className="mt-3 font-sans text-sm text-ink-soft">
            Nenhum depoimento cadastrado ainda.
          </p>
        ) : (
          <div className="mt-4 flex flex-col gap-3">
            {feedbacks.map((fb) => (
              <div
                key={fb.id}
                className="flex items-start gap-3 rounded-2xl border border-stone-200 px-4 py-3"
              >
                {fb.avatar_url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={fb.avatar_url}
                    alt={fb.author_name}
                    className="h-10 w-10 shrink-0 rounded-full object-cover"
                  />
                ) : (
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-wine-100 text-wine-700">
                    <User size={18} />
                  </span>
                )}
                <div className="flex-1">
                  <p className="font-sans text-sm font-semibold text-ink">
                    {fb.author_name}
                  </p>
                  <p className="mt-0.5 font-sans text-sm text-ink-soft">{fb.message}</p>
                </div>
                <button
                  type="button"
                  onClick={() => handleRemover(fb.id)}
                  disabled={isPending}
                  className="shrink-0 text-ink-soft/60 transition-colors hover:text-red-600"
                  aria-label="Remover depoimento"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

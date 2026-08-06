import { User } from "lucide-react";
import { createClient } from "@/lib/supabase/server";

export default async function Testimonials() {
  const supabase = await createClient();

  const { data: feedbacks } = await supabase
    .from("feedbacks")
    .select("id, author_name, message, avatar_url")
    .order("created_at", { ascending: false })
    .limit(6);

  if (!feedbacks || feedbacks.length === 0) return null;

  return (
    <section id="depoimentos" className="bg-nude px-5 py-24 sm:px-8 sm:py-32">
      <div className="mx-auto max-w-7xl">
        <div className="mx-auto max-w-2xl text-center">
          <p className="mb-4 font-sans text-xs font-semibold uppercase tracking-[0.14em] text-wine-700">
            Depoimentos
          </p>
          <h2 className="font-display text-3xl leading-tight text-wine-900 sm:text-4xl">
            Quem já viveu a experiência Thays Flor
          </h2>
        </div>

        <div className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {feedbacks.map((fb) => (
            <div
              key={fb.id}
              className="flex flex-col rounded-[1.75rem] border border-stone-200 bg-cream p-7"
            >
              <p className="flex-1 font-sans text-[15px] leading-relaxed text-ink-soft">
                &ldquo;{fb.message}&rdquo;
              </p>
              <div className="mt-6 flex items-center gap-3">
                {fb.avatar_url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={fb.avatar_url}
                    alt={fb.author_name}
                    className="h-11 w-11 rounded-full object-cover"
                  />
                ) : (
                  <span className="flex h-11 w-11 items-center justify-center rounded-full bg-wine-100 text-wine-700">
                    <User size={20} />
                  </span>
                )}
                <span className="font-sans text-sm font-semibold text-ink">
                  {fb.author_name}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

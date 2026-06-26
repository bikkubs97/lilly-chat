import Link from "next/link";
import { Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import Header from "../../_partials/header";
import Footer from "../../_partials/footer";

export default function SupportCancelPage() {
  return (
    <main className="flex min-h-screen flex-col bg-gradient-to-br from-slate-950 via-violet-950 to-slate-950 text-white">
      <Header />

      <section className="flex flex-1 items-center justify-center px-4 py-24">
        <div className="w-full max-w-lg rounded-3xl border border-purple-700 bg-slate-950/95 p-8 text-center shadow-2xl shadow-black/30">
          <Heart className="mx-auto mb-5 h-12 w-12 text-fuchsia-300" />
          <h1 className="text-3xl font-bold">Donation canceled</h1>
          <p className="mt-4 text-sm leading-relaxed text-slate-300">
            No payment was completed. You can return to Lilly or try the test
            donation checkout again whenever you like.
          </p>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
            <Button asChild>
              <Link href="/">Back to Lilly</Link>
            </Button>
            <Button asChild variant="secondary">
              <Link href="/#support-lilly">Try again</Link>
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}

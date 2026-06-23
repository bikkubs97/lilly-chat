import Link from "next/link";
import { CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import Header from "../../_partials/header";
import Footer from "../../_partials/footer";

export default function SupportSuccessPage() {
  return (
    <main className="flex min-h-screen flex-col bg-gradient-to-br from-slate-950 via-violet-950 to-slate-950 text-white">
      <Header />

      <section className="flex flex-1 items-center justify-center px-4 py-24">
        <div className="w-full max-w-lg rounded-3xl border border-purple-700 bg-slate-950/95 p-8 text-center shadow-2xl shadow-black/30">
          <CheckCircle2 className="mx-auto mb-5 h-12 w-12 text-emerald-300" />
          <h1 className="text-3xl font-bold">Thank you for supporting Lilly</h1>
          <p className="mt-4 text-sm leading-relaxed text-slate-300">
            This payment flow is currently marked as a test donation page. If
            you used Stripe test details, no real charge was made.
          </p>
          <Link href="/">
            <Button className="mt-6 rounded-full bg-purple-600 px-8 py-5 text-white hover:bg-pink-500">
              Back to Lilly
            </Button>
          </Link>
        </div>
      </section>

      <Footer />
    </main>
  );
}

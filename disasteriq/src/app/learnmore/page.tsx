import { Shield, Heart, Hospital, Users } from "lucide-react";
import Link from "next/link";
import { Button } from "@/app/components/ui/button";

export default function LearnMorePage() {
  return (
    <div className="min-h-screen bg-slate-950 text-white px-6 py-20">

      {/* Heading */}
      <div className="max-w-4xl mx-auto text-center">
        <h1 className="text-5xl font-extrabold mb-6">
          About DisasterRelief Platform
        </h1>

        <p className="text-lg text-slate-300 mb-12">
          DisasterRelief is a unified disaster response coordination system
          connecting governments, NGOs, hospitals, and citizens in real-time.
        </p>
      </div>

      {/* Key Highlights */}
      <div className="max-w-6xl mx-auto grid sm:grid-cols-2 lg:grid-cols-4 gap-6">

        <div className="bg-white/5 p-6 rounded-2xl border border-white/10">
          <Shield className="h-8 w-8 text-blue-400 mb-4" />
          <h3 className="font-semibold text-xl mb-2">Government Control</h3>
          <p className="text-slate-300 text-sm">
            Authorities can declare disasters and broadcast alerts instantly.
          </p>
        </div>

        <div className="bg-white/5 p-6 rounded-2xl border border-white/10">
          <Heart className="h-8 w-8 text-green-400 mb-4" />
          <h3 className="font-semibold text-xl mb-2">NGO Support</h3>
          <p className="text-slate-300 text-sm">
            NGOs manage resources, volunteers, and relief distribution.
          </p>
        </div>

        <div className="bg-white/5 p-6 rounded-2xl border border-white/10">
          <Hospital className="h-8 w-8 text-red-400 mb-4" />
          <h3 className="font-semibold text-xl mb-2">Hospital Network</h3>
          <p className="text-slate-300 text-sm">
            Hospitals update emergency readiness and medical support availability.
          </p>
        </div>

        <div className="bg-white/5 p-6 rounded-2xl border border-white/10">
          <Users className="h-8 w-8 text-yellow-400 mb-4" />
          <h3 className="font-semibold text-xl mb-2">Citizen Help</h3>
          <p className="text-slate-300 text-sm">
            Citizens can request help, view alerts, and stay informed.
          </p>
        </div>

      </div>

      {/* CTA Buttons */}
      <div className="text-center mt-16 flex justify-center gap-4">
        <Link href="/alerts">
          <Button size="lg">View Alerts</Button>
        </Link>

        <Link href="/">
          <Button size="lg" variant="outline">
            Back Home
          </Button>
        </Link>
      </div>
    </div>
  );
}

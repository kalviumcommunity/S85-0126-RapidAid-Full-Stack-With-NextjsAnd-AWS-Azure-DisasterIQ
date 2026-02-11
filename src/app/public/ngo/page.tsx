"use client";

import { useEffect, useState } from "react";
import { DashboardLayout } from "@/app/components/DashboardLayout";

type NGO = {
  id: string;
  name: string;
  registrationNumber: string;
  state: string;
  focusArea: string;
  contactEmail: string;
  contactPhone: string;
};

export default function Page() {
  const [ngos, setNgos] = useState<NGO[]>([]);
  const [loading, setLoading] = useState(true);
  const [showFormFor, setShowFormFor] = useState<string | null>(null);
  const [preferredRole, setPreferredRole] =
    useState<string>("GROUND_VOLUNTEER");
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState<string | null>(null);

  useEffect(() => {
    const fetchNgos = async () => {
      try {
        const res = await fetch("http://localhost:3000/Api/ngo/all", {
          method: "GET",
          credentials: "include", // ✅ include cookies
        });

        const json = await res.json();
        setNgos(json.data || []);
      } catch (error) {
        console.error("Failed to fetch NGOs", error);
      } finally {
        setLoading(false);
      }
    };

    fetchNgos();
  }, []);

  return (
    <DashboardLayout role="public" userName="publicuser">
      <div className="space-y-6 text-white">
        <h1 className="text-3xl font-bold">Registered NGOs</h1>

        {loading && <p className="text-white/60">Loading NGOs...</p>}
        {!loading && ngos.length === 0 && (
          <p className="text-white/60">No NGOs found.</p>
        )}

        <div className="grid gap-4 md:grid-cols-2">
          {ngos.map((ngo) => (
            <div
              key={ngo.id}
              className="rounded-xl bg-white/5 border border-white/10 p-5 space-y-2"
            >
              <h2 className="text-lg font-semibold">{ngo.name}</h2>

              <p className="text-white/70">
                <strong>Focus:</strong> {ngo.focusArea}
              </p>

              <p className="text-white/70">
                <strong>State:</strong> {ngo.state}
              </p>

              <p className="text-white/60 text-sm">
                Reg. No: {ngo.registrationNumber}
              </p>

              <hr className="border-white/10 my-2" />

              <p className="text-white/60 text-sm">📧 {ngo.contactEmail}</p>
              <p className="text-white/60 text-sm">📞 {ngo.contactPhone}</p>

              <div className="pt-3">
                <button
                  className="rounded-md bg-blue-600 px-3 py-1 text-sm font-medium hover:bg-blue-700"
                  onClick={() => {
                    setShowFormFor(ngo.id);
                    setPreferredRole("GROUND_VOLUNTEER");
                    setSubmitError(null);
                    setSubmitSuccess(null);
                  }}
                >
                  Be a Volunteer
                </button>
              </div>

              {/* Volunteer Form */}
              {showFormFor === ngo.id && (
                <div className="mt-4 p-4 rounded-md bg-white/6 border border-white/10">
                  <h3 className="font-semibold text-white">
                    Become a Volunteer at {ngo.name}
                  </h3>

                  <div className="mt-3 space-y-2">
                    <label className="block text-sm text-white/80">
                      NGO ID
                    </label>
                    <input
                      readOnly
                      value={ngo.id}
                      className="w-full rounded-md bg-white/5 border border-white/10 px-2 py-1 text-sm text-white/80"
                    />

                    <label className="block text-sm text-white/80">
                      Preferred Role
                    </label>
                    <select
                      value={preferredRole}
                      onChange={(e) => setPreferredRole(e.target.value)}
                      className="w-full rounded-md bg-white/5 border border-white/10 px-2 py-1 text-sm text-white/80"
                    >
                      <option value="GROUND_VOLUNTEER">
                        Ground Volunteer
                      </option>
                      <option value="MEDICAL_VOLUNTEER">
                        Medical Volunteer
                      </option>
                      <option value="RESCUE_VOLUNTEER">
                        Rescue Volunteer
                      </option>
                    </select>

                    {submitError && (
                      <p className="text-sm text-red-400">{submitError}</p>
                    )}
                    {submitSuccess && (
                      <p className="text-sm text-green-400">
                        {submitSuccess}
                      </p>
                    )}

                    <div className="flex gap-2 pt-3">
                      <button
                        disabled={submitting}
                        onClick={async () => {
                          setSubmitting(true);
                          setSubmitError(null);
                          setSubmitSuccess(null);

                          try {
                            const res = await fetch(
                              "http://localhost:3000/Api/auth/signup-with-role-preference",
                              {
                                method: "POST",
                                credentials: "include", // ✅ REQUIRED
                                headers: {
                                  "Content-Type": "application/json",
                                },
                                body: JSON.stringify({
                                  ngoId: ngo.id,
                                  preferredRole,
                                }),
                              }
                            );

                            const json = await res.json();

                            if (!res.ok) {
                              setSubmitError(
                                json.message ||
                                  json.error ||
                                  "Failed to submit request"
                              );
                            } else {
                              setSubmitSuccess(
                                json.message ||
                                  "Volunteer request submitted"
                              );
                              setTimeout(
                                () => setShowFormFor(null),
                                1200
                              );
                            }
                          } catch (err: any) {
                            setSubmitError(
                              err?.message || "Network error"
                            );
                          } finally {
                            setSubmitting(false);
                          }
                        }}
                        className="rounded-md bg-green-600 px-3 py-1 text-sm font-medium hover:bg-green-700 disabled:opacity-60"
                      >
                        {submitting ? "Submitting..." : "Submit"}
                      </button>

                      <button
                        onClick={() => {
                          setShowFormFor(null);
                          setSubmitError(null);
                          setSubmitSuccess(null);
                        }}
                        className="rounded-md bg-white/5 px-3 py-1 text-sm hover:bg-white/10"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}

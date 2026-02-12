"use client";

import { useEffect, useState } from "react";
import { DashboardLayout } from "@/app/components";
import { Button } from "@/app/components/ui";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/app/components/ui/select";
import { authApi } from "@/app/lib/authFetch";
import {
  Users,
  AlertTriangle,
  Plus,
  Send,
  CheckCircle,
  XCircle,
  Clock,
  MapPin,
} from "lucide-react";

type NGO = {
  id: string;
  name: string;
  state: string;
  focusArea: string;
  contactEmail: string;
  contactPhone: string;
  createdAt: string;
};

type Disaster = {
  id: string;
  name: string;
  type: string;
  location: string;
  severity: number;
  status: string;
  reportedAt: string;
};

type NGORequest = {
  id: string;
  disasterId: string;
  ngoId: string;
  status: "PENDING" | "ACCEPTED" | "REJECTED";
  createdAt: string;
  disaster?: Disaster;
  ngo?: NGO;
};

export default function Page() {
  const [disasters, setDisasters] = useState<Disaster[]>([]);
  const [ngos, setNGOs] = useState<NGO[]>([]);
  const [requests, setRequests] = useState<NGORequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [selectedDisaster, setSelectedDisaster] =
    useState<Disaster | null>(null);
  const [selectedNGO, setSelectedNGO] = useState<NGO | null>(null);

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    try {
      setLoading(true);

      const [disRes, ngoRes, reqRes] = await Promise.all([
        authApi.get("/Api/disasters/get"),
        authApi.get("/Api/government/ngos"),
        authApi.get("/Api/ngoRequest"),
      ]);

      if (disRes.ok) {
        const data = await disRes.json();
        setDisasters(Array.isArray(data.data) ? data.data : []);
      }

      if (ngoRes.ok) {
        const data = await ngoRes.json();
        setNGOs(Array.isArray(data.data) ? data.data : []);
      }

      if (reqRes.ok) {
        const data = await reqRes.json();
        setRequests(Array.isArray(data.data) ? data.data : []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const closeModal = () => {
    setShowAssignModal(false);
    setSelectedDisaster(null);
    setSelectedNGO(null);
  };

  const handleAssignNGO = (disaster: Disaster) => {
    setSelectedDisaster(disaster);
    setShowAssignModal(true);
  };

  const handleSubmitAssignment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDisaster || !selectedNGO) return;

    try {
      const response = await authApi.post("/Api/ngoRequest/create", {
        disasterId: selectedDisaster.id,
        ngoId: selectedNGO.id,
      });

      if (!response.ok) {
        const err = await response.json();
        alert(err.message || "Assignment failed");
        return;
      }

      closeModal();
      fetchAllData();
    } catch (error) {
      alert("Server error");
    }
  };

  const getSeverityStyles = (severity: number) => {
    if (severity >= 7)
      return {
        badge: "bg-red-500/20 text-red-400",
        bar: "bg-red-500",
      };
    if (severity >= 4)
      return {
        badge: "bg-yellow-500/20 text-yellow-400",
        bar: "bg-yellow-500",
      };
    return {
      badge: "bg-green-500/20 text-green-400",
      bar: "bg-green-500",
    };
  };

  const getStatusIcon = (status: string) => {
    if (status === "ACCEPTED")
      return <CheckCircle className="h-4 w-4 text-green-400" />;
    if (status === "REJECTED")
      return <XCircle className="h-4 w-4 text-red-400" />;
    return <Clock className="h-4 w-4 text-yellow-400" />;
  };

  return (
    <DashboardLayout role="government" userName="Gov. Official">
      <div className="space-y-8 text-white">

        {/* SECTION HEADER */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold flex items-center gap-2">
              <AlertTriangle className="h-6 w-6 text-yellow-400" />
              Active Disasters
            </h1>
            <p className="text-sm text-white/60 mt-1">
              Assign NGOs to respond quickly
            </p>
          </div>

          <span className="px-3 py-1 bg-blue-500/20 text-blue-400 rounded-full text-sm">
            {disasters.length} Active
          </span>
        </div>

        {/* DISASTER LIST */}
        <div className="space-y-4">
          {loading && <p className="text-white/60">Loading...</p>}

          {!loading &&
            disasters.map((disaster) => {
              const styles = getSeverityStyles(disaster.severity);

              return (
                <div
                  key={disaster.id}
                  className="relative p-6 rounded-xl 
                  bg-gradient-to-br from-slate-800 to-slate-900
                  border border-white/10
                  hover:border-blue-500/40
                  hover:shadow-lg hover:shadow-blue-500/10
                  transition-all duration-300"
                >
                  {/* Left severity bar */}
                  <div
                    className={`absolute left-0 top-0 h-full w-1 rounded-l-xl ${styles.bar}`}
                  />

                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="text-lg font-semibold">
                        {disaster.name}
                      </h3>

                      <p className="text-white/60 text-sm mt-1">
                        {disaster.type}
                      </p>

                      <div className="flex items-center gap-4 mt-3 text-sm">
                        <span className="flex items-center gap-1 text-white/70">
                          <MapPin className="h-4 w-4" />
                          {disaster.location}
                        </span>

                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium ${styles.badge}`}
                        >
                          Severity {disaster.severity}
                        </span>
                      </div>
                    </div>

                    <Button
                      onClick={() => handleAssignNGO(disaster)}
                      className="bg-blue-600 hover:bg-blue-700 shadow-md"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Assign NGO
                    </Button>
                  </div>
                </div>
              );
            })}
        </div>

        {/* ASSIGNMENT MODAL */}
        {showAssignModal && selectedDisaster && (
          <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
            <div className="bg-slate-900 p-6 rounded-xl w-full max-w-md border border-white/10">
              <h3 className="text-lg font-semibold mb-4">
                Assign NGO to {selectedDisaster.name}
              </h3>

              <form onSubmit={handleSubmitAssignment} className="space-y-4">
                <Select
                  value={selectedNGO?.id || ""}
                  onValueChange={(value) =>
                    setSelectedNGO(
                      ngos.find((n) => n.id === value) || null
                    )
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Choose NGO" />
                  </SelectTrigger>
                  <SelectContent>
                    {ngos.map((ngo) => (
                      <SelectItem key={ngo.id} value={ngo.id}>
                        {ngo.name} - {ngo.state}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <div className="flex gap-3">
                  <Button type="submit" className="flex-1">
                    <Send className="h-4 w-4 mr-2" />
                    Assign
                  </Button>

                  <Button
                    type="button"
                    variant="outline"
                    onClick={closeModal}
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* RECENT ASSIGNMENTS */}
        <div>
          <h2 className="text-xl font-semibold flex items-center gap-2 mb-4">
            <Users className="h-5 w-5 text-blue-400" />
            Recent Assignments
          </h2>

          <div className="space-y-3">
            {requests.map((req) => (
              <div
                key={req.id}
                className="p-4 rounded-xl bg-slate-900 border border-white/10 
                hover:border-white/20 transition"
              >
                <div className="flex justify-between items-center">
                  <div>
                    <h4 className="font-medium">
                      {req.disaster?.name}
                    </h4>
                    <p className="text-sm text-white/60">
                      Assigned to {req.ngo?.name}
                    </p>
                    <p className="text-xs text-white/40 mt-1">
                      {new Date(req.createdAt).toLocaleString()}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    {getStatusIcon(req.status)}
                    <span className="text-sm font-medium">
                      {req.status}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </DashboardLayout>
  );
}

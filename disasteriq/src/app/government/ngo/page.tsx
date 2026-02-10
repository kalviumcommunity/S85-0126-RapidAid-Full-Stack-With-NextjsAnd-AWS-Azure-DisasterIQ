"use client";

import { useEffect, useState } from "react";
import { DashboardLayout } from "@/app/components/DashboardLayout";
import { Button } from "@/app/components/ui/button";
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
    const fetchData = async () => {
      try {
        const disastersRes = await authApi.get("/Api/disasters/get");
        if (disastersRes.ok) {
          const data = await disastersRes.json();
          setDisasters(data.data || []);
        }

        const ngosRes = await authApi.get("/Api/government/ngos");
        if (ngosRes.ok) {
          const data = await ngosRes.json();
          setNGOs(data.data || []);
        }

        const requestsRes = await authApi.get("/Api/ngoRequest/get");
        if (requestsRes.ok) {
          const data = await requestsRes.json();
          setRequests(data.data || []);
        }
      } catch (err) {
        console.error("Fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleAssignNGO = (disaster: Disaster) => {
    setSelectedDisaster(disaster);
    setShowAssignModal(true);
  };

  // ✅ FIXED FUNCTION
  const handleSubmitAssignment = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedDisaster || !selectedNGO) {
      alert("Please select both a disaster and an NGO");
      return;
    }

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

      alert("NGO Assigned Successfully!");
      setShowAssignModal(false);
      setSelectedDisaster(null);
      setSelectedNGO(null);

      // Optional refresh
      const requestsRes = await authApi.get("/Api/ngoRequest/get");
      if (requestsRes.ok) {
        const data = await requestsRes.json();
        setRequests(data.data || []);
      }
    } catch (err) {
      console.error("Assign error:", err);
      alert("Error assigning NGO");
    }
  };

  const getSeverityColor = (severity: number) => {
    if (severity >= 7) return "text-red-400";
    if (severity >= 4) return "text-yellow-400";
    return "text-green-400";
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
      <div className="space-y-6 text-white">

        {/* Header */}
        <div className="rounded-xl bg-white/5 border border-white/10 p-6">
          <h1 className="text-2xl font-semibold">NGO Disaster Assignment</h1>
          <p className="text-white/70">
            Assign NGOs to respond to active disasters
          </p>
        </div>

        {/* Active Disasters */}
        <div className="rounded-xl bg-white/5 border border-white/10 p-6">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <AlertTriangle className="h-5 w-5" />
            Active Disasters
          </h2>

          {loading ? (
            <p>Loading...</p>
          ) : disasters.length === 0 ? (
            <p>No active disasters found</p>
          ) : (
            disasters.map((disaster) => (
              <div
                key={disaster.id}
                className="p-4 rounded-lg bg-white/5 border border-white/10"
              >
                <div className="flex justify-between">
                  <div>
                    <h3>{disaster.name}</h3>
                    <p className="text-sm text-white/70">{disaster.type}</p>
                    <div className="flex gap-4 text-sm mt-2">
                      <span className="flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        {disaster.location}
                      </span>
                      <span className={getSeverityColor(disaster.severity)}>
                        Severity: {disaster.severity}
                      </span>
                    </div>
                  </div>

                  <Button
                    onClick={() => handleAssignNGO(disaster)}
                    className="bg-blue-600"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Assign NGO
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Modal */}
        {showAssignModal && selectedDisaster && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white/10 rounded-xl p-6 max-w-md w-full">
              <h3 className="mb-4">
                Assign NGO to {selectedDisaster.name}
              </h3>

              <form onSubmit={handleSubmitAssignment} className="space-y-4">
                <Select
                  value={selectedNGO?.id || ""}
                  onValueChange={(id) =>
                    setSelectedNGO(ngos.find((n) => n.id === id) || null)
                  }
                >
                  <SelectTrigger className="bg-gray-800">
                    <SelectValue placeholder="Select NGO" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-900">
                    {ngos.map((ngo) => (
                      <SelectItem key={ngo.id} value={ngo.id}>
                        {ngo.name} - {ngo.state}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Button type="submit" className="bg-blue-600 w-full">
                  <Send className="h-4 w-4 mr-2" />
                  Assign NGO
                </Button>
              </form>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}

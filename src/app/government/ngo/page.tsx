"use client";

import { useEffect, useState } from "react";
import { DashboardLayout } from "@/app/components/DashboardLayout";
import { Button } from "@/app/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/app/components/ui/select";
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
  const [selectedDisaster, setSelectedDisaster] = useState<Disaster | null>(null);
  const [selectedNGO, setSelectedNGO] = useState<NGO | null>(null);

  // Fetch disasters, NGOs, and requests
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch disasters
        const disastersRes = await authApi.get("/Api/disasters/get");
        if (disastersRes.ok) {
          const disastersData = await disastersRes.json();
          setDisasters(disastersData.data || []);
        }

        // Fetch NGOs
        const ngosRes = await authApi.get("/Api/government/ngos");
        if (ngosRes.ok) {
          const ngosData = await ngosRes.json();
          setNGOs(ngosData.data || []);
        }

        // Fetch existing requests
        const requestsRes = await authApi.get("/Api/ngoRequest"); // Assuming this endpoint exists
        if (requestsRes.ok) {
          const requestsData = await requestsRes.json();
          setRequests(requestsData.data || []);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
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

      if (response.ok) {
        alert("NGO Assigned Successfully!");
        setShowAssignModal(false);
        setSelectedDisaster(null);
        setSelectedNGO(null);
        
        // Refresh requests list
        const requestsRes = await authApi.get("/Api/ngoRequest");
        if (requestsRes.ok) {
          const requestsData = await requestsRes.json();
          setRequests(requestsData.data || []);
        }
      } else {
        const errorData = await response.json();
        alert(errorData.message || "Failed to assign NGO");
      }
    } catch (error) {
      console.error("Error assigning NGO:", error);
      alert("Error assigning NGO");
    }
  };

  const getSeverityColor = (severity: number) => {
    if (severity >= 7) return "text-red-400";
    if (severity >= 4) return "text-yellow-400";
    return "text-green-400";
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "ACCEPTED": return <CheckCircle className="h-4 w-4 text-green-400" />;
      case "REJECTED": return <XCircle className="h-4 w-4 text-red-400" />;
      default: return <Clock className="h-4 w-4 text-yellow-400" />;
    }
  };

  return (
    <DashboardLayout role="government" userName="Gov. Official">
      <div className="space-y-6 text-white">
        {/* Header */}
        <div className="rounded-xl bg-white/5 backdrop-blur border border-white/10 p-6">
          <h1 className="text-2xl font-semibold mb-2">NGO Disaster Assignment</h1>
          <p className="text-white/70">
            Assign NGOs to respond to active disasters
          </p>
        </div>

        {/* Active Disasters */}
        <div className="rounded-xl bg-white/5 backdrop-blur border border-white/10 p-6">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <AlertTriangle className="h-5 w-5" />
            Active Disasters
          </h2>
          
          {loading ? (
            <p className="text-white/70">Loading disasters...</p>
          ) : disasters.length === 0 ? (
            <p className="text-white/70">No active disasters found</p>
          ) : (
            <div className="space-y-3">
              {disasters.map((disaster) => (
                <div key={disaster.id} className="p-4 rounded-lg bg-white/5 border border-white/10">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="font-medium">{disaster.name}</h3>
                      <p className="text-sm text-white/70">{disaster.type}</p>
                      <div className="flex items-center gap-4 text-sm mt-2">
                        <span className="flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          {disaster.location}
                        </span>
                        <span className={`font-medium ${getSeverityColor(disaster.severity)}`}>
                          Severity: {disaster.severity}
                        </span>
                        <span className="text-white/50">
                          {new Date(disaster.reportedAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    <Button
                      onClick={() => handleAssignNGO(disaster)}
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Assign NGO
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* NGO Assignment Modal */}
        {showAssignModal && selectedDisaster && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white/10 backdrop-blur border border-white/20 rounded-xl p-6 max-w-md w-full mx-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">
                  Assign NGO to {selectedDisaster.name}
                </h3>
                <Button
                  variant="ghost"
                  onClick={() => setShowAssignModal(false)}
                  className="text-white/70 hover:text-white"
                >
                  ×
                </Button>
              </div>

              <form onSubmit={handleSubmitAssignment} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Select NGO</label>
                  <Select
                    value={selectedNGO?.id || ""}
                    onValueChange={(value) => {
                      const ngo = ngos.find(n => n.id === value);
                      setSelectedNGO(ngo || null);
                    }}
                  >
                    <SelectTrigger className="bg-gray-800 text-white border-gray-600">
                      <SelectValue placeholder="Choose an NGO..." />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-900 text-white border-gray-700">
                      {ngos.map((ngo) => (
                        <SelectItem key={ngo.id} value={ngo.id}>
                          {ngo.name} - {ngo.state}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {selectedNGO && (
                  <div className="p-3 rounded bg-white/10 border border-white/20">
                    <p className="text-sm">
                      <strong>{selectedNGO.name}</strong><br />
                      {selectedNGO.focusArea}<br />
                      {selectedNGO.contactEmail}
                    </p>
                  </div>
                )}

                <div className="flex gap-3">
                  <Button
                    type="submit"
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    <Send className="h-4 w-4 mr-2" />
                    Assign NGO
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowAssignModal(false)}
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Recent NGO Assignments */}
        <div className="rounded-xl bg-white/5 backdrop-blur border border-white/10 p-6">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Users className="h-5 w-5" />
            Recent NGO Assignments
          </h2>
          
          {requests.length === 0 ? (
            <p className="text-white/70">No NGO assignments made yet</p>
          ) : (
            <div className="space-y-3">
              {requests.map((request) => (
                <div key={request.id} className="p-4 rounded-lg bg-white/5 border border-white/10">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h4 className="font-medium">
                        {request.disaster?.name || 'Unknown Disaster'}
                      </h4>
                      <p className="text-sm text-white/70">
                        Assigned to: {request.ngo?.name || 'Unknown NGO'}
                      </p>
                      <p className="text-xs text-white/50">
                        {new Date(request.createdAt).toLocaleString()}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      {getStatusIcon(request.status)}
                      <span className="text-sm font-medium">{request.status}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}

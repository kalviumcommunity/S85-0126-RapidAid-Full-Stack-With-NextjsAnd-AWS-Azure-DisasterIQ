"use client";

import { useEffect, useState } from "react";
import { DashboardLayout } from "@/app/components/DashboardLayout";
import { Button } from "@/app/components/ui/button";
import { authApi } from "@/app/lib/authFetch";
import {
  AlertTriangle,
  CheckCircle,
  XCircle,
  Clock,
  MapPin,
} from "lucide-react";

type NGORequest = {
  id: string;
  disasterId: string;
  ngoId: string;
  status: "PENDING" | "ACCEPTED" | "REJECTED";
  createdAt: string;
  respondedAt?: string;
  disaster?: {
    id: string;
    name: string;
    type: string;
    location: string;
    severity: number;
    reportedAt: string;
  };
  government?: {
    id: string;
    name: string;
    state: string;
  };
};

export default function NGORequestsPage() {
  const [requests, setRequests] = useState<NGORequest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const response = await authApi.get("/Api/ngoRequest/get");
        if (response.ok) {
          const data = await response.json();
          setRequests(data.data || []);
        }
      } catch (error) {
        console.error("Error fetching requests:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRequests();
  }, []);

  const handleRespondToRequest = async (requestId: string, status: "ACCEPTED" | "REJECTED") => {
    try {
      const response = await authApi.patch(`/Api/ngoRequest/${requestId}/respond`, {
        status,
      });

      if (response.ok) {
        alert(`Request ${status.toLowerCase()} successfully!`);
        
        // Refresh requests
        const requestsRes = await authApi.get("/Api/ngoRequest/get");
        if (requestsRes.ok) {
          const requestsData = await requestsRes.json();
          setRequests(requestsData.data || []);
        }
      } else {
        const errorData = await response.json();
        alert(errorData.message || "Failed to respond to request");
      }
    } catch (error) {
      console.error("Error responding to request:", error);
      alert("Error responding to request");
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case "ACCEPTED": return "text-green-400";
      case "REJECTED": return "text-red-400";
      default: return "text-yellow-400";
    }
  };

  return (
    <DashboardLayout role="ngo" userName="NGO Coordinator">
      <div className="space-y-6 text-white">
        {/* Header */}
        <div className="rounded-xl bg-white/5 backdrop-blur border border-white/10 p-6">
          <h1 className="text-2xl font-semibold mb-2">Disaster Assignment Requests</h1>
          <p className="text-white/70">
            View and respond to disaster assignment requests from government agencies
          </p>
        </div>

        {/* Requests List */}
        <div className="rounded-xl bg-white/5 backdrop-blur border border-white/10 p-6">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <AlertTriangle className="h-5 w-5" />
            Assignment Requests
          </h2>
          
          {loading ? (
            <p className="text-white/70">Loading requests...</p>
          ) : requests.length === 0 ? (
            <p className="text-white/70">No assignment requests found</p>
          ) : (
            <div className="space-y-3">
              {requests.map((request) => (
                <div key={request.id} className="p-4 rounded-lg bg-white/5 border border-white/10">
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex-1">
                      <h3 className="font-medium text-lg">
                        {request.disaster?.name || 'Unknown Disaster'}
                      </h3>
                      <p className="text-sm text-white/70 mb-2">{request.disaster?.type}</p>
                      
                      {request.disaster && (
                        <div className="flex items-center gap-4 text-sm mb-2">
                          <span className="flex items-center gap-1">
                            <MapPin className="h-3 w-3" />
                            {request.disaster.location}
                          </span>
                          <span className={`font-medium ${getSeverityColor(request.disaster.severity)}`}>
                            Severity: {request.disaster.severity}
                          </span>
                        </div>
                      )}

                      <div className="flex items-center gap-4 text-sm">
                        <span className="text-white/50">
                          From: {request.government?.name || 'Government Agency'}
                        </span>
                        <span className="text-white/50">
                          {new Date(request.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {getStatusIcon(request.status)}
                      <span className={`text-sm font-medium ${getStatusColor(request.status)}`}>
                        {request.status}
                      </span>
                    </div>
                  </div>

                  {/* Action Buttons for PENDING requests */}
                  {request.status === "PENDING" && (
                    <div className="flex gap-2 mt-3 pt-3 border-t border-white/20">
                      <Button
                        size="sm"
                        onClick={() => handleRespondToRequest(request.id, "ACCEPTED")}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Accept Assignment
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleRespondToRequest(request.id, "REJECTED")}
                        className="border-red-600 text-red-400 hover:bg-red-600/10"
                      >
                        <XCircle className="h-4 w-4 mr-2" />
                        Decline Assignment
                      </Button>
                    </div>
                  )}

                  {/* Response info for COMPLETED requests */}
                  {request.status !== "PENDING" && request.respondedAt && (
                    <div className="mt-3 pt-3 border-t border-white/20">
                      <p className="text-xs text-white/60">
                        Responded {new Date(request.respondedAt).toLocaleString()}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Stats Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="rounded-xl bg-white/5 backdrop-blur border border-white/10 p-6">
            <div className="flex items-center gap-3">
              <Clock className="h-8 w-8 text-yellow-400" />
              <div>
                <p className="text-2xl font-bold">
                  {requests.filter(r => r.status === "PENDING").length}
                </p>
                <p className="text-sm text-white/70">Pending</p>
              </div>
            </div>
          </div>

          <div className="rounded-xl bg-white/5 backdrop-blur border border-white/10 p-6">
            <div className="flex items-center gap-3">
              <CheckCircle className="h-8 w-8 text-green-400" />
              <div>
                <p className="text-2xl font-bold">
                  {requests.filter(r => r.status === "ACCEPTED").length}
                </p>
                <p className="text-sm text-white/70">Accepted</p>
              </div>
            </div>
          </div>

          <div className="rounded-xl bg-white/5 backdrop-blur border border-white/10 p-6">
            <div className="flex items-center gap-3">
              <XCircle className="h-8 w-8 text-red-400" />
              <div>
                <p className="text-2xl font-bold">
                  {requests.filter(r => r.status === "REJECTED").length}
                </p>
                <p className="text-sm text-white/70">Rejected</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

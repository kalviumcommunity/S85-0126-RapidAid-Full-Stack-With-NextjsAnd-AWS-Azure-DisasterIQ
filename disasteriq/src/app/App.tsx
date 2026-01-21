// import { Toaster } from "@/app/components/ui/toaster";
// import { Toaster as Sonner } from "@/app/components/ui/sonner";
// import { TooltipProvider } from "@/app/components/ui/tooltip";
// import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
// import { BrowserRouter, Routes, Route } from "react-router-dom";
// import Index from "./pages/Index";
// import NotFound from "./pages/NotFound";
// import AdminDashboard from "./pages/admin/AdminDashboard";
// import GovernmentDashboard from "./pages/government/GovernmentDashboard";
// import ResponderDashboard from "./pages/responder/ResponderDashboard";
// import PublicAlerts from "./pages/public/PublicAlerts";

// const queryClient = new QueryClient();

// const App = () => (
//   <QueryClientProvider client={queryClient}>
//     <TooltipProvider>
//       <Toaster />
//       <Sonner />
//       <BrowserRouter>
//         <Routes>
//           <Route path="/" element={<Index />} />
//           <Route path="/admin" element={<AdminDashboard />} />
//           <Route path="/government" element={<GovernmentDashboard />} />
//           <Route path="/responder" element={<ResponderDashboard />} />
//           <Route path="/alerts" element={<PublicAlerts />} />
//           {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
//           <Route path="*" element={<NotFound />} />
//         </Routes>
//       </BrowserRouter>
//     </TooltipProvider>
//   </QueryClientProvider>
// );

// export default App;

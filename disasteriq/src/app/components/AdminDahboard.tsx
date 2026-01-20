// import { ReactNode, useState } from "react";
// import { Link, useLocation } from "react-router-dom";
// import {
//   LayoutDashboard,
//   Users,
//   AlertTriangle,
//   Building2,
//   FileText,
//   Settings,
//   LogOut,
//   Menu,
//   X,
//   Shield,
//   Bell,
// } from "lucide-react";
// import { cn } from "@/lib/utils";
// import { Button } from "@/components/ui/button";

// interface NavItem {
//   label: string;
//   href: string;
//   icon: React.ElementType;
// }

// interface DashboardLayoutProps {
//   children: ReactNode;
//   role: "admin" | "government" | "responder" | "public";
//   userName?: string;
// }

// const navItems: Record<string, NavItem[]> = {
//   admin: [
//     { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
//     { label: "Disasters", href: "/admin/disasters", icon: AlertTriangle },
//     { label: "Users", href: "/admin/users", icon: Users },
//     { label: "Organizations", href: "/admin/organizations", icon: Building2 },
//     { label: "Reports", href: "/admin/reports", icon: FileText },
//     { label: "Settings", href: "/admin/settings", icon: Settings },
//   ],
//   government: [
//     { label: "Dashboard", href: "/government", icon: LayoutDashboard },
//     { label: "Disasters", href: "/government/disasters", icon: AlertTriangle },
//     { label: "Coordination", href: "/government/coordination", icon: Building2 },
//     { label: "Resources", href: "/government/resources", icon: Shield },
//     { label: "Reports", href: "/government/reports", icon: FileText },
//   ],
//   responder: [
//     { label: "Dashboard", href: "/responder", icon: LayoutDashboard },
//     { label: "Assigned Disasters", href: "/responder/disasters", icon: AlertTriangle },
//     { label: "Resources", href: "/responder/resources", icon: Shield },
//     { label: "Operations", href: "/responder/operations", icon: Building2 },
//   ],
//   public: [],
// };

// const roleLabels = {
//   admin: "Administrator",
//   government: "Government Authority",
//   responder: "NGO / Hospital",
//   public: "Public User",
// };

// const roleColors = {
//   admin: "bg-primary",
//   government: "bg-info",
//   responder: "bg-success",
//   public: "bg-accent",
// };

// export function DashboardLayout({ children, role, userName = "User" }: DashboardLayoutProps) {
//   const [sidebarOpen, setSidebarOpen] = useState(true);
//   const location = useLocation();
//   const items = navItems[role];

//   return (
//     <div className="min-h-screen flex w-full bg-background">
//       {/* Sidebar */}
//       <aside
//         className={cn(
//           "fixed inset-y-0 left-0 z-50 flex flex-col bg-sidebar transition-all duration-300 lg:relative",
//           sidebarOpen ? "w-64" : "w-0 lg:w-20"
//         )}
//       >
//         {/* Logo */}
//         <div className="flex h-16 items-center justify-between px-4 border-b border-sidebar-border">
//           <Link to="/" className="flex items-center gap-3">
//             <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center", roleColors[role])}>
//               <Shield className="w-5 h-5 text-primary-foreground" />
//             </div>
//             {sidebarOpen && (
//               <span className="font-semibold text-sidebar-foreground">DisasterRelief</span>
//             )}
//           </Link>
//           <Button
//             variant="ghost"
//             size="icon"
//             className="lg:hidden text-sidebar-foreground"
//             onClick={() => setSidebarOpen(false)}
//           >
//             <X className="h-5 w-5" />
//           </Button>
//         </div>

//         {/* Navigation */}
//         <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
//           {items.map((item) => {
//             const isActive = location.pathname === item.href;
//             return (
//               <Link
//                 key={item.href}
//                 to={item.href}
//                 className={cn("nav-item", isActive && "active")}
//               >
//                 <item.icon className="h-5 w-5 shrink-0" />
//                 {sidebarOpen && <span>{item.label}</span>}
//               </Link>
//             );
//           })}
//         </nav>

//         {/* User section */}
//         <div className="p-4 border-t border-sidebar-border">
//           <div className={cn("flex items-center gap-3", !sidebarOpen && "justify-center")}>
//             <div className="w-10 h-10 rounded-full bg-sidebar-accent flex items-center justify-center">
//               <span className="text-sm font-medium text-sidebar-foreground">
//                 {userName.charAt(0).toUpperCase()}
//               </span>
//             </div>
//             {sidebarOpen && (
//               <div className="flex-1 min-w-0">
//                 <p className="text-sm font-medium text-sidebar-foreground truncate">{userName}</p>
//                 <p className="text-xs text-sidebar-foreground/60">{roleLabels[role]}</p>
//               </div>
//             )}
//           </div>
//           {sidebarOpen && (
//             <Button
//               variant="ghost"
//               className="w-full mt-3 text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent justify-start"
//             >
//               <LogOut className="h-4 w-4 mr-2" />
//               Sign Out
//             </Button>
//           )}
//         </div>
//       </aside>

//       {/* Main content */}
//       <div className="flex-1 flex flex-col min-w-0">
//         {/* Top bar */}
//         <header className="h-16 border-b border-border bg-card flex items-center justify-between px-4 lg:px-6">
//           <div className="flex items-center gap-4">
//             <Button
//               variant="ghost"
//               size="icon"
//               onClick={() => setSidebarOpen(!sidebarOpen)}
//               className="shrink-0"
//             >
//               <Menu className="h-5 w-5" />
//             </Button>
//             <div className="hidden sm:block">
//               <h1 className="text-lg font-semibold">
//                 {items.find((item) => item.href === location.pathname)?.label || "Dashboard"}
//               </h1>
//             </div>
//           </div>
//           <div className="flex items-center gap-3">
//             <Button variant="ghost" size="icon" className="relative">
//               <Bell className="h-5 w-5" />
//               <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-critical rounded-full text-[10px] text-critical-foreground flex items-center justify-center">
//                 3
//               </span>
//             </Button>
//           </div>
//         </header>

//         {/* Page content */}
//         <main className="flex-1 p-4 lg:p-6 overflow-auto">{children}</main>
//       </div>

//       {/* Mobile overlay */}
//       {sidebarOpen && (
//         <div
//           className="fixed inset-0 bg-foreground/20 backdrop-blur-sm z-40 lg:hidden"
//           onClick={() => setSidebarOpen(false)}
//         />
//       )}
//     </div>
//   );
// }

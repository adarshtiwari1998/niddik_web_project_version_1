import { AdminLayout } from "@/components/layout/AdminLayout";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Briefcase, MessageCircle, Building2, UserCircle } from "lucide-react";

export default function AdminDashboard() {
  // In a real app, these would come from API calls
  const stats = [
    {
      title: "Job Listings",
      value: "12",
      description: "Active listings",
      icon: <Briefcase className="h-8 w-8 text-blue-500" />,
    },
    {
      title: "Contact Submissions",
      value: "24",
      description: "Last 30 days",
      icon: <MessageCircle className="h-8 w-8 text-green-500" />,
    },
    {
      title: "Clients",
      value: "8",
      description: "Total clients",
      icon: <Building2 className="h-8 w-8 text-purple-500" />,
    },
    {
      title: "Testimonials",
      value: "16",
      description: "Published testimonials",
      icon: <UserCircle className="h-8 w-8 text-amber-500" />,
    },
  ];

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            Overview of your website statistics and activity.
          </p>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat, index) => (
            <Card key={index}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {stat.title}
                </CardTitle>
                {stat.icon}
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground">
                  {stat.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <Card className="col-span-1">
            <CardHeader>
              <CardTitle>Recent Job Listings</CardTitle>
              <CardDescription>
                Recently published job opportunities
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center border-b pb-2">
                  <div>
                    <p className="font-medium">Senior React Developer</p>
                    <p className="text-sm text-muted-foreground">
                      Posted: May 1, 2025
                    </p>
                  </div>
                  <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                    Active
                  </span>
                </div>
                <div className="flex justify-between items-center border-b pb-2">
                  <div>
                    <p className="font-medium">Product Manager</p>
                    <p className="text-sm text-muted-foreground">
                      Posted: April 29, 2025
                    </p>
                  </div>
                  <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                    Active
                  </span>
                </div>
                <div className="flex justify-between items-center border-b pb-2">
                  <div>
                    <p className="font-medium">DevOps Engineer</p>
                    <p className="text-sm text-muted-foreground">
                      Posted: April 25, 2025
                    </p>
                  </div>
                  <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                    Active
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="col-span-1">
            <CardHeader>
              <CardTitle>Recent Contact Inquiries</CardTitle>
              <CardDescription>
                Latest inquiries from potential clients
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center border-b pb-2">
                  <div>
                    <p className="font-medium">John Smith</p>
                    <p className="text-sm text-muted-foreground">
                      Tech Talent Solutions
                    </p>
                  </div>
                  <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                    New
                  </span>
                </div>
                <div className="flex justify-between items-center border-b pb-2">
                  <div>
                    <p className="font-medium">Alice Johnson</p>
                    <p className="text-sm text-muted-foreground">
                      Innovative Corp
                    </p>
                  </div>
                  <span className="text-xs bg-gray-100 text-gray-800 px-2 py-1 rounded-full">
                    Viewed
                  </span>
                </div>
                <div className="flex justify-between items-center border-b pb-2">
                  <div>
                    <p className="font-medium">Robert Davis</p>
                    <p className="text-sm text-muted-foreground">
                      Growth Industries
                    </p>
                  </div>
                  <span className="text-xs bg-gray-100 text-gray-800 px-2 py-1 rounded-full">
                    Viewed
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
}
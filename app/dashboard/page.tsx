"use client"

import { Card } from "@/components/ui/Card"
import { Button } from "@/components/ui/button"
import { SelectWrapper } from "@/components/ui/Select"
import { cn } from "@/lib/utils"
import {
  ResponsiveContainer,
  LineChart,
  Line,
  AreaChart,
  Area,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
} from "recharts"
import { FileText, Users, Eye, Clock, TrendingUp, Calendar, BarChart3, Globe } from "lucide-react"
import Image from "next/image"

// Color system (exactly 5):
// 1) Primary blue (sky)      2) Neutral white   3) Neutral slate
// 4) Accent violet           5) Accent amber

type SparkPoint = { x: number; y: number }

const sparklineData: SparkPoint[] = [
  { x: 1, y: 18 },
  { x: 2, y: 22 },
  { x: 3, y: 20 },
  { x: 4, y: 28 },
  { x: 5, y: 26 },
  { x: 6, y: 30 },
]

const contentPerformanceData = [
  { name: "Jan", views: 1200, posts: 8 },
  { name: "Feb", views: 1500, posts: 12 },
  { name: "Mar", views: 2200, posts: 15 },
  { name: "Apr", views: 3800, posts: 18 },
  { name: "May", views: 4200, posts: 22 },
  { name: "Jun", views: 4800, posts: 25 },
  { name: "Jul", views: 4400, posts: 20 },
  { name: "Aug", views: 4000, posts: 18 },
  { name: "Sep", views: 3600, posts: 16 },
]

const contentTypesData = [
  { name: "Published", value: 45, color: "#10b981" }, // emerald-500
  { name: "Draft", value: 22, color: "#f59e0b" }, // amber-500
  { name: "Scheduled", value: 18, color: "#3b82f6" }, // blue-500
  { name: "Archived", value: 15, color: "#6b7280" }, // gray-500
]

const userActivityData = [
  { name: "Jan", NewUsers: 80, ActiveUsers: 60 },
  { name: "Feb", NewUsers: 70, ActiveUsers: 55 },
  { name: "Mar", NewUsers: 90, ActiveUsers: 70 },
  { name: "Apr", NewUsers: 85, ActiveUsers: 65 },
  { name: "May", NewUsers: 100, ActiveUsers: 80 },
  { name: "Jun", NewUsers: 95, ActiveUsers: 75 },
  { name: "Jul", NewUsers: 110, ActiveUsers: 85 },
  { name: "Aug", NewUsers: 105, ActiveUsers: 90 },
  { name: "Sep", NewUsers: 120, ActiveUsers: 95 },
]

function MiniSparkline({ stroke }: { stroke: string }) {
  return (
    <ResponsiveContainer width="100%" height={44}>
      <LineChart data={sparklineData} margin={{ top: 6, right: 0, left: 0, bottom: 0 }}>
        <Line dataKey="y" type="monotone" stroke={stroke} strokeWidth={2} dot={false} />
      </LineChart>
    </ResponsiveContainer>
  )
}

function StatCard(props: {
  title: string
  value: number | string
  delta: string
  tint: "sky" | "violet" | "amber" | "rose"
  icon: React.ReactNode
  sparklineColor: string
}) {
  const bgMap = {
    sky: "bg-gradient-to-br from-[#DAEEFF] to-[#7ED3F9]",
    violet: "bg-gradient-to-br from-[#E1DAFF] to-[#AB9CFF]", 
    amber: "bg-gradient-to-br from-[#FFF3DA] to-[#FFCE97]",
    rose: "bg-gradient-to-br from-[#FFDADA] to-[#FF9E9E]",
  }

  const textColorMap = {
    sky: "text-sky-800",
    violet: "text-violet-800", 
    amber: "text-amber-800",
    rose: "text-rose-800",
  }

  return (
    <div className={cn("rounded-2xl p-6 relative", bgMap[props.tint])}>
      {/* Icon in top left */}
      <div className="flex justify-between items-start mb-4">
        <div className="p-2 rounded-lg bg-white/20">
          <div className={cn("w-8 h-8", textColorMap[props.tint])}>
            {props.icon}
          </div>
        </div>
        <div className="text-right">
          <span className={cn("text-sm font-medium", textColorMap[props.tint])}>↗ {props.delta}</span>
        </div>
      </div>
      
      {/* Title and Value */}
      <div className="mb-4">
        <p className={cn("text-sm font-medium mb-1", textColorMap[props.tint])}>{props.title}</p>
        <p className={cn("text-3xl font-bold", textColorMap[props.tint])}>{props.value}</p>
      </div>

      {/* Sparkline in bottom right */}
      <div className="absolute bottom-4 right-4 w-20 h-8">
        <MiniSparkline stroke={props.sparklineColor} />
      </div>
    </div>
  )
}

export default function DashboardPage() {
  return (
    <main className="space-y-6">
      {/* <header className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold text-balance">Dashboard</h1>
          <p className="text-sm text-muted-foreground">Overview of your metrics and orders.</p>
        </div>
        <Button>Download Report</Button>
      </header> */}

      {/* Top Stats */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Total Posts" 
          value="1,247" 
          delta="+12.5%" 
          tint="sky" 
          icon={<FileText className="w-8 h-8" />}
          sparklineColor="#0ea5e9"
        />
        <StatCard 
          title="Published" 
          value={892} 
          delta="+8.2%" 
          tint="violet" 
          icon={<Eye className="w-8 h-8" />}
          sparklineColor="#8b5cf6"
        />
        <StatCard 
          title="Drafts" 
          value={156} 
          delta="+3.1%" 
          tint="amber" 
          icon={<Clock className="w-8 h-8" />}
          sparklineColor="#f59e0b"
        />
        <StatCard 
          title="Total Users" 
          value="2,847" 
          delta="+15.3%" 
          tint="rose" 
          icon={<Users className="w-8 h-8" />}
          sparklineColor="#ef4444"
        />
      </section>

      {/* Charts row */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Content Performance (left) */}
        <Card className="shadow-sm col-span-2">
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-light-gray-800 mb-4">Content Performance</h3>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 bg-blue-600 rounded-md flex items-center justify-center">
                <TrendingUp className="w-4 h-4 text-white" />
              </div>
              <div>
                <p className="text-sm font-medium text-light-gray-800">Monthly Overview</p>
                <p className="text-xs text-light-gray-500">Views & Posts Published</p>
              </div>
            </div>
          </div>
          
          <div className="h-[350px] relative">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={contentPerformanceData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                <defs>
                  <linearGradient id="areaFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#0ea5e9" stopOpacity={0.4} />
                    <stop offset="100%" stopColor="#0ea5e9" stopOpacity={0.05} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 12, fill: '#64748b' }}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 12, fill: '#64748b' }} 
                  tickFormatter={(v) => `${v}`}
                  domain={[0, 5000]}
                />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: 'white',
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="views"
                  stroke="#0ea5e9"
                  strokeWidth={2}
                  fill="url(#areaFill)"
                  dot={{ fill: '#0ea5e9', strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6, fill: '#0ea5e9' }}
                />
              </AreaChart>
            </ResponsiveContainer>
            
            {/* Performance label with marker line */}
            <div className="absolute top-12 left-32">
              <div className="bg-white border border-dark-200 rounded-md px-3 py-2 shadow-sm">
                <p className="text-xs text-light-gray-600">September 2024</p>
                <p className="text-sm font-medium text-light-gray-800">Page Views <span className="text-green-600">+12.3%</span></p>
              </div>
            </div>
            
            {/* Vertical line marker */}
            <div className="absolute top-16 left-44 w-px h-48 bg-dark-300 opacity-60"></div>
          </div>
        </Card>

        {/* Content Types (right) */}
        <Card className="shadow-sm col-span-1">
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-light-gray-800">Content Types</h3>
              <SelectWrapper
                placeholder="All Time"
                options={[
                  { value: "week", label: "This Week" },
                  { value: "month", label: "This Month" },
                  { value: "year", label: "This Year" }
                ]}
                className="w-32 [&>div]:space-y-0 [&_label]:hidden"
              />
            </div>
          </div>
          <div className="flex flex-col items-center">
            <div className="h-[280px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={contentTypesData}
                    dataKey="value"
                    nameKey="name"
                    innerRadius={80}
                    outerRadius={120}
                    paddingAngle={3}
                    cx="50%"
                    cy="50%"
                  >
                    {contentTypesData.map((d, i) => (
                      <Cell key={i} fill={d.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Legend */}
            <div className="flex items-center justify-center gap-6 w-full mt-4">
              {contentTypesData.map((d) => (
                <div key={d.name} className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: d.color }}></div>
                  <span className="text-sm text-light-gray-600">{d.name}</span>
                </div>
              ))}
            </div>
          </div>
        </Card>
      </section>

      {/* User Activity */}
      <section className="mt-8">
        <Card className="shadow-sm ">
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-light-gray-800">User Activity Overview</h3>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-primary-blue rounded"></div>
                  <span className="text-sm text-light-gray-600">New Users</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-teal-500 rounded"></div>
                  <span className="text-sm text-light-gray-600">Active Users</span>
                </div>
              </div>
            </div>
          </div>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart 
                data={userActivityData} 
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                barCategoryGap="20%"
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 12, fill: '#64748b' }} 
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 12, fill: '#64748b' }}
                  domain={[0, 120]}
                />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: 'white',
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                  }}
                />
                <Bar 
                  dataKey="NewUsers" 
                  fill="#3b82f6" 
                  radius={[4, 4, 0, 0]}
                  maxBarSize={40}
                />
                <Bar 
                  dataKey="ActiveUsers" 
                  fill="#14b8a6" 
                  radius={[4, 4, 0, 0]}
                  maxBarSize={40}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </section>

      {/* CMS Widgets */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
        {/* Recent Posts */}
        <Card className="shadow-sm">
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-light-gray-800">Recent Posts</h3>
              <Button variant="outline" size="sm">View All</Button>
            </div>
            <div className="space-y-4">
              {[
                { title: "Getting Started with Next.js 14", status: "Published", views: 1247, date: "2 hours ago" },
                { title: "Building Responsive UIs with Tailwind", status: "Draft", views: 0, date: "1 day ago" },
                { title: "Advanced React Patterns", status: "Published", views: 892, date: "3 days ago" },
                { title: "CMS Best Practices", status: "Scheduled", views: 0, date: "5 days ago" },
              ].map((post, index) => (
                <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
                  <div className="flex-1">
                    <h4 className="text-sm font-medium text-gray-900 mb-1">{post.title}</h4>
                    <div className="flex items-center gap-4 text-xs text-gray-500">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        post.status === 'Published' ? 'bg-green-100 text-green-800' :
                        post.status === 'Draft' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-blue-100 text-blue-800'
                      }`}>
                        {post.status}
                      </span>
                      <span>{post.views} views</span>
                      <span>{post.date}</span>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm">Edit</Button>
                </div>
              ))}
            </div>
          </div>
        </Card>

        {/* Popular Content */}
        <Card className="shadow-sm">
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-light-gray-800">Popular Content</h3>
              <Button variant="outline" size="sm">View Analytics</Button>
            </div>
            <div className="space-y-4">
              {[
                { title: "Complete Guide to Web Development", views: 15420, engagement: "94%", trend: "+12%" },
                { title: "Modern JavaScript Features", views: 12890, engagement: "89%", trend: "+8%" },
                { title: "CSS Grid vs Flexbox", views: 11200, engagement: "92%", trend: "+15%" },
                { title: "API Design Best Practices", views: 9870, engagement: "87%", trend: "+5%" },
              ].map((content, index) => (
                <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
                  <div className="flex-1">
                    <h4 className="text-sm font-medium text-gray-900 mb-1">{content.title}</h4>
                    <div className="flex items-center gap-4 text-xs text-gray-500">
                      <span>{content.views.toLocaleString()} views</span>
                      <span>{content.engagement} engagement</span>
                      <span className="text-green-600 font-medium">{content.trend}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="sm">View</Button>
                    <Button variant="ghost" size="sm">Edit</Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Card>
      </section>
    </main>
  )
} 
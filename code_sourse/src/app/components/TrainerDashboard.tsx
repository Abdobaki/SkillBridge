import { useState, useMemo } from 'react';
import {
  LayoutDashboard,
  GraduationCap,
  BookOpen,
  DollarSign,
  Settings,
  ArrowLeft,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Search,
  PlusCircle,
  TrendingUp,
  Users,
  Wallet,
} from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { CourseProposal, Enrollment } from '../types';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from 'recharts';

interface TrainerDashboardProps {
  trainerName: string;
  trainerEmail: string;
  proposals: CourseProposal[];
  enrollments?: Enrollment[];
  onBack: () => void;
  onViewProposals: () => void;
  onEditProposal: (proposal: CourseProposal) => void;
  onBrowseJobs?: () => void;
  onPostJob?: () => void;
}

export function TrainerDashboard({
  trainerName,
  trainerEmail,
  proposals,
  enrollments = [],
  onBack,
  onViewProposals,
  onEditProposal,
  onBrowseJobs,
  onPostJob,
}: TrainerDashboardProps) {
  const [activeSection, setActiveSection] = useState('overview');

  // Calculate statistics
  const pendingProposals = proposals.filter((p) => p.status === 'pending').length;
  const approvedProposals = proposals.filter((p) => p.status === 'approved').length;

  // Calculate Earnings
  const earningsData = useMemo(() => {
    const approvedCourseIds = proposals
      .filter(p => p.status === 'approved')
      .map(p => ({ id: p.id, title: p.courseTitle, price: p.basePrice }));
    
    let totalRevenue = 0;
    const monthlyData: { [key: string]: number } = {};
    const courseStats: { [key: string]: { students: number, revenue: number, title: string } } = {};

    enrollments.forEach(enrol => {
      const course = approvedCourseIds.find(c => c.title === enrol.courseTitle);
      if (course) {
        const rev = course.price;
        totalRevenue += rev;

        // Monthly data
        const date = new Date(enrol.enrolledDate);
        const month = date.toLocaleString('default', { month: 'short' });
        monthlyData[month] = (monthlyData[month] || 0) + rev;

        // Course stats
        if (!courseStats[enrol.courseTitle]) {
          courseStats[enrol.courseTitle] = { students: 0, revenue: 0, title: enrol.courseTitle };
        }
        courseStats[enrol.courseTitle].students += 1;
        courseStats[enrol.courseTitle].revenue += rev;
      }
    });

    // Format chart data
    const chartData = Object.entries(monthlyData).map(([name, value]) => ({ name, value }));
    // If no data, provide mock data for visual demo
    const finalChartData = chartData.length > 0 ? chartData : [
      { name: 'Jan', value: 400 },
      { name: 'Feb', value: 300 },
      { name: 'Mar', value: 600 },
      { name: 'Apr', value: 800 },
      { name: 'May', value: 500 },
      { name: 'Jun', value: 900 },
    ];

    return {
      totalRevenue,
      chartData: finalChartData,
      courseStats: Object.values(courseStats),
      totalStudents: enrollments.length
    };
  }, [proposals, enrollments]);

  return (
    <div className="flex-1 min-h-0 flex flex-col bg-background">
      {/* Header */}
      <div className="px-6 pt-12 pb-4 bg-primary">
        <button onClick={onBack} className="p-2 -ml-2 mb-4">
          <ArrowLeft className="w-6 h-6 text-white" />
        </button>
        <div className="flex items-center gap-4 mb-6">
          <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center overflow-hidden">
            <GraduationCap className="w-8 h-8 text-white" />
          </div>
          <div>
            <h1 className="text-xl text-white mb-1">Trainer Dashboard</h1>
            <p className="text-sm text-white/80">{trainerName}</p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex gap-2 overflow-x-auto pb-2 -mx-6 px-6">
          <Button
            variant={activeSection === 'overview' ? 'secondary' : 'ghost'}
            size="sm"
            onClick={() => setActiveSection('overview')}
            className={
              activeSection === 'overview'
                ? 'bg-white text-primary'
                : 'text-white/80 hover:text-white hover:bg-white/10'
            }
          >
            <LayoutDashboard className="w-4 h-4 mr-2" />
            Overview
          </Button>
          <Button
            variant={activeSection === 'proposals' ? 'secondary' : 'ghost'}
            size="sm"
            onClick={() => setActiveSection('proposals')}
            className={
              activeSection === 'proposals'
                ? 'bg-white text-primary'
                : 'text-white/80 hover:text-white hover:bg-white/10'
            }
          >
            <BookOpen className="w-4 h-4 mr-2" />
            Proposals
          </Button>
          <Button
            variant={activeSection === 'profits' ? 'secondary' : 'ghost'}
            size="sm"
            onClick={() => setActiveSection('profits')}
            className={
              activeSection === 'profits'
                ? 'bg-white text-primary'
                : 'text-white/80 hover:text-white hover:bg-white/10'
            }
          >
            <DollarSign className="w-4 h-4 mr-2" />
            Profits
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6 pb-24">
        {activeSection === 'overview' && (
          <div className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-card rounded-2xl p-5 border border-border">
                <div className="flex items-center justify-between mb-2">
                  <BookOpen className="w-5 h-5 text-primary" />
                  <Badge variant="secondary" className="bg-accent/10 text-accent border-0">
                    {pendingProposals} Pending
                  </Badge>
                </div>
                <p className="text-2xl text-foreground mb-1">{proposals.length}</p>
                <p className="text-sm text-muted-foreground">Total Proposals</p>
              </div>

              <div className="bg-card rounded-2xl p-5 border border-border">
                <div className="flex items-center justify-between mb-2">
                  <CheckCircle2 className="w-5 h-5 text-accent" />
                </div>
                <p className="text-2xl text-foreground mb-1">{approvedProposals}</p>
                <p className="text-sm text-muted-foreground">Approved Courses</p>
              </div>
            </div>

            {/* Quick Stats Banner */}
            <div className="bg-gradient-to-br from-accent/20 to-primary/10 rounded-2xl p-5 border border-accent/20 flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Total Earnings</p>
                <p className="text-2xl font-bold text-foreground">€{earningsData.totalRevenue}</p>
              </div>
              <Button size="sm" variant="outline" onClick={() => setActiveSection('profits')} className="border-accent text-accent">
                View Details
              </Button>
            </div>

            {/* Recent Proposals */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-foreground font-medium">Recent Proposals</h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onViewProposals}
                  className="text-primary"
                >
                  View All
                </Button>
              </div>
              <div className="space-y-3">
                {proposals.length === 0 ? (
                  <div className="bg-card rounded-2xl p-8 border border-border text-center">
                    <GraduationCap className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
                    <p className="text-foreground mb-1">No proposals yet</p>
                    <p className="text-sm text-muted-foreground">
                      Start by browsing job opportunities and proposing courses
                    </p>
                  </div>
                ) : (
                  proposals.slice(0, 3).map((proposal) => (
                    <div key={proposal.id} className="bg-card rounded-2xl p-4 border border-border">
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="text-foreground flex-1 font-medium">{proposal.courseTitle}</h4>
                        <Badge
                          variant="secondary"
                          className={
                            proposal.status === 'approved'
                              ? 'bg-accent/10 text-accent border-0'
                              : proposal.status === 'pending'
                              ? 'bg-accent-orange/10 text-accent-orange border-0'
                              : 'bg-destructive/10 text-destructive border-0'
                          }
                        >
                          {proposal.status === 'approved' && <CheckCircle2 className="w-3 h-3 mr-1" />}
                          {proposal.status === 'pending' && <Clock className="w-3 h-3 mr-1" />}
                          {proposal.status === 'rejected' && <XCircle className="w-3 h-3 mr-1" />}
                          {proposal.status.charAt(0).toUpperCase() + proposal.status.slice(1)}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">
                        Related to: {proposal.relatedJobTitle}
                      </p>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span>€{proposal.finalPrice}</span>
                        <span>•</span>
                        <span>{proposal.duration}</span>
                        <span>•</span>
                        <span>
                          min {proposal.minStudents} students
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Quick Actions */}
            <div>
              <h3 className="text-foreground font-medium mb-4">Quick Actions</h3>
              <div className="grid grid-cols-1 gap-3">
                {onBrowseJobs && (
                  <Button
                    variant="outline"
                    onClick={onBrowseJobs}
                    className="justify-start h-auto py-4 border-accent text-accent hover:bg-accent/10"
                  >
                    <Search className="w-5 h-5 mr-3" />
                    <div className="text-left">
                      <p className="text-foreground">Browse Job Opportunities</p>
                      <p className="text-xs text-muted-foreground">
                        Find new opportunities to create courses
                      </p>
                    </div>
                  </Button>
                )}
                <Button
                  variant="outline"
                  onClick={onViewProposals}
                  className="justify-start h-auto py-4"
                >
                  <BookOpen className="w-5 h-5 mr-3" />
                  <div className="text-left">
                    <p className="text-foreground">Manage Course Proposals</p>
                    <p className="text-xs text-muted-foreground">
                      View and edit your course submissions
                    </p>
                  </div>
                </Button>
                {onPostJob && (
                  <Button
                    variant="outline"
                    onClick={onPostJob}
                    className="justify-start h-auto py-4 border-primary text-primary hover:bg-primary/10"
                  >
                    <PlusCircle className="w-5 h-5 mr-3" />
                    <div className="text-left">
                      <p className="text-foreground">Post a Job Announcement</p>
                      <p className="text-xs text-muted-foreground">
                        Share job opportunities with the community
                      </p>
                    </div>
                  </Button>
                )}
              </div>
            </div>
          </div>
        )}

        {activeSection === 'proposals' && (
          <div className="space-y-4">
            {proposals.length === 0 ? (
              <div className="bg-card rounded-2xl p-8 border border-border text-center">
                <GraduationCap className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
                <p className="text-foreground mb-1">No proposals yet</p>
                <p className="text-sm text-muted-foreground mb-4">
                  Start by browsing job opportunities and proposing courses
                </p>
                {onBrowseJobs && (
                  <Button onClick={onBrowseJobs} className="bg-primary text-white">
                    Browse Jobs
                  </Button>
                )}
              </div>
            ) : (
              proposals.map((proposal) => {
                const createdTime = new Date(proposal.createdAt).getTime();
                const nowTime = new Date().getTime();
                const hoursPassed = (nowTime - createdTime) / (1000 * 60 * 60);
                const canEdit = hoursPassed <= 24;

                return (
                  <div key={proposal.id} className="bg-card rounded-2xl p-5 border border-border">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h4 className="text-foreground mb-1 font-medium">{proposal.courseTitle}</h4>
                        <p className="text-sm text-muted-foreground">
                          Related to: {proposal.relatedJobTitle}
                        </p>
                      </div>
                      <Badge
                        variant="secondary"
                        className={
                          proposal.status === 'approved'
                            ? 'bg-accent/10 text-accent border-0'
                            : proposal.status === 'pending'
                            ? 'bg-accent-orange/10 text-accent-orange border-0'
                            : 'bg-destructive/10 text-destructive border-0'
                        }
                      >
                        {proposal.status === 'approved' && <CheckCircle2 className="w-3 h-3 mr-1" />}
                        {proposal.status === 'pending' && <Clock className="w-3 h-3 mr-1" />}
                        {proposal.status === 'rejected' && <XCircle className="w-3 h-3 mr-1" />}
                        {proposal.status.charAt(0).toUpperCase() + proposal.status.slice(1)}
                      </Badge>
                    </div>

                    <p className="text-sm text-muted-foreground mb-4">{proposal.courseDescription}</p>

                    <div className="flex flex-wrap gap-2 mb-4">
                      {proposal.skillsCovered.map((skill, idx) => (
                        <Badge key={idx} variant="secondary" className="bg-muted text-muted-foreground border-0">
                          {skill}
                        </Badge>
                      ))}
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground mb-1">Your Price</p>
                        <p className="text-foreground font-medium">€{proposal.basePrice}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground mb-1">Student Price</p>
                        <p className="text-foreground font-medium">€{proposal.finalPrice}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground mb-1">Duration</p>
                        <p className="text-foreground font-medium">{proposal.duration}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground mb-1">Enrollment</p>
                        <p className="text-foreground font-medium">
                          min {proposal.minStudents} students
                        </p>
                      </div>
                    </div>

                    {proposal.adminFeedback && (
                      <div className="mt-4 p-3 bg-accent-orange/10 rounded-xl border border-accent-orange/20">
                        <div className="flex gap-2">
                          <AlertCircle className="w-4 h-4 text-accent-orange shrink-0 mt-0.5" />
                          <div>
                            <p className="text-sm text-foreground mb-1 font-medium">Admin Feedback</p>
                            <p className="text-sm text-muted-foreground">{proposal.adminFeedback}</p>
                          </div>
                        </div>
                      </div>
                    )}

                    <div className="flex gap-2 mt-4">
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1"
                        onClick={() => onEditProposal(proposal)}
                        disabled={!canEdit}
                        title={!canEdit ? 'Cannot edit after 24 hours of submission' : undefined}
                      >
                        Edit
                      </Button>
                      {proposal.status === 'rejected' && (
                        <Button
                          size="sm"
                          className="flex-1 bg-primary text-white"
                          onClick={() => onEditProposal(proposal)}
                        >
                          Resubmit
                        </Button>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        )}

        {activeSection === 'profits' && (
          <div className="space-y-6">
            {/* Profits Header Cards */}
            <div className="grid grid-cols-1 gap-4">
              <div className="bg-gradient-to-br from-primary to-primary/80 rounded-2xl p-6 text-white shadow-lg">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                    <Wallet className="w-6 h-6" />
                  </div>
                  <Badge className="bg-white/20 text-white border-0">Monthly Revenue</Badge>
                </div>
                <p className="text-sm text-white/70 mb-1">Total Balance</p>
                <div className="flex items-baseline gap-2">
                  <h2 className="text-3xl font-bold">€{earningsData.totalRevenue}</h2>
                  <span className="text-sm text-white/70 font-medium">
                    <TrendingUp className="w-3 h-3 inline mr-1" />
                    +12% from last month
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-card rounded-2xl p-5 border border-border">
                  <div className="w-10 h-10 bg-accent/10 rounded-xl flex items-center justify-center mb-3">
                    <Users className="w-5 h-5 text-accent" />
                  </div>
                  <p className="text-2xl font-bold text-foreground">{earningsData.totalStudents}</p>
                  <p className="text-xs text-muted-foreground">Total Students</p>
                </div>
                <div className="bg-card rounded-2xl p-5 border border-border">
                  <div className="w-10 h-10 bg-accent-orange/10 rounded-xl flex items-center justify-center mb-3">
                    <BookOpen className="w-5 h-5 text-accent-orange" />
                  </div>
                  <p className="text-2xl font-bold text-foreground">{approvedProposals}</p>
                  <p className="text-xs text-muted-foreground">Active Courses</p>
                </div>
              </div>
            </div>

            {/* Sales Chart */}
            <div className="bg-card rounded-2xl p-5 border border-border shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-foreground font-medium">Sales Chart</h3>
                <select className="bg-transparent text-sm text-muted-foreground outline-none border-none">
                  <option>Last 6 Months</option>
                  <option>Last Year</option>
                </select>
              </div>
              <div className="h-[250px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={earningsData.chartData}>
                    <defs>
                      <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#4F46E5" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#4F46E5" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                    <XAxis 
                      dataKey="name" 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fill: '#9CA3AF', fontSize: 12 }} 
                    />
                    <YAxis 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fill: '#9CA3AF', fontSize: 12 }}
                      tickFormatter={(value) => `€${value}`}
                    />
                    <Tooltip 
                      contentStyle={{ 
                        borderRadius: '12px', 
                        border: 'none', 
                        boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)',
                        backgroundColor: '#FFF'
                      }}
                      itemStyle={{ color: '#4F46E5', fontWeight: '600' }}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="value" 
                      stroke="#4F46E5" 
                      strokeWidth={3}
                      fillOpacity={1} 
                      fill="url(#colorValue)" 
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Revenue by Course */}
            <div>
              <h3 className="text-foreground font-medium mb-4">Revenue by Course</h3>
              <div className="space-y-3">
                {earningsData.courseStats.length === 0 ? (
                  <div className="bg-card rounded-2xl p-8 border border-border text-center">
                    <p className="text-sm text-muted-foreground">No course earnings yet.</p>
                  </div>
                ) : (
                  earningsData.courseStats.map((stat, idx) => (
                    <div key={idx} className="bg-card rounded-2xl p-4 border border-border flex items-center justify-between">
                      <div className="flex-1">
                        <p className="text-sm font-medium text-foreground mb-1">{stat.title}</p>
                        <p className="text-xs text-muted-foreground">{stat.students} Students</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-bold text-foreground">€{stat.revenue}</p>
                        <div className="w-24 h-1.5 bg-muted rounded-full mt-2 overflow-hidden">
                          <div 
                            className="h-full bg-accent" 
                            style={{ width: `${Math.min(100, (stat.revenue / earningsData.totalRevenue) * 100)}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
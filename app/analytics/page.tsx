"use client"

import { Suspense, useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { FileText, AlertTriangle, BarChart3, PieChart, Bot, Users } from "lucide-react"
import { DataQualityChart } from "@/components/analytics/data-quality-chart"
import { IssuesBySpecialtyChart } from "@/components/analytics/issues-by-specialty-chart"
import { SpecialtyExperienceChart } from "@/components/analytics/specialty-experience-chart"
import { ProvidersByStateChart } from "@/components/analytics/providers-by-state-chart"
import { Sidebar } from "@/components/layout/sidebar"
import { ThemeToggle } from "@/components/theme-toggle"
import Link from "next/link"

interface ProcessedData {
  clusters: Record<
    string,
    {
      members: number[]
      representative: number
    }
  >
  summary: {
    total_records: number
    candidate_pairs: number
    duplicate_pairs: number
    unique_involved: number
    ca_state: number
    clusters: number
    compliance_rate: number
    data_quality_score: number
    expired_licenses: number
    final_records: number
    formatting_issues: number
    missing_npi: number
    ny_state: number
    outliers_removed: number
    providers_available: number
  }
}

// Mock data for records with most issues
const recordsWithIssues = [
  {
    id: "PR_00015",
    name: "Jennifer Lopez, MD PhD",
    specialty: "Cardiology",
    issues: ["Expired License", "Phone Format"],
    issueCount: 2,
    riskLevel: "high",
  },
  {
    id: "PR_00018",
    name: "David Clark, DO PhD",
    specialty: "Internal Medicine",
    issues: ["Duplicate Record", "Address Format"],
    issueCount: 2,
    riskLevel: "medium",
  },
  {
    id: "PR_00021",
    name: "Sarah Johnson, MD",
    specialty: "Pulmonology",
    issues: ["Missing NPI"],
    issueCount: 1,
    riskLevel: "low",
  },
  {
    id: "PR_00024",
    name: "Michael Brown, DO",
    specialty: "Cardiology",
    issues: ["Expired License", "Phone Format", "Address Format"],
    issueCount: 3,
    riskLevel: "high",
  },
]

export default function AnalyticsPage() {
  const [processedData, setProcessedData] = useState<ProcessedData | null>(null)

  useEffect(() => {
    const storedData = localStorage.getItem("processedData")
    if (storedData) {
      try {
        setProcessedData(JSON.parse(storedData))
      } catch (error) {
        console.error("Failed to parse stored data:", error)
      }
    }
  }, [])

  const metrics = {
    dataQualityScore: processedData?.summary.data_quality_score || 86.87,
    totalProviders: processedData?.summary.total_records || 524,
    criticalIssues: processedData?.summary.duplicate_pairs || 42,
    complianceRate: processedData?.summary.compliance_rate || 187.21,
    expiredLicensesCount: processedData?.summary.expired_licenses || 471,
    expiredLicensesPercent: processedData
      ? (((processedData.summary.expired_licenses || 0) / processedData.summary.total_records) * 100).toFixed(1)
      : "89.9",
    candidatePairs: processedData?.summary.candidate_pairs || 46229,
    totalClusters: processedData?.summary.clusters || 33,
    uniqueInvolved: processedData?.summary.unique_involved || 71,
    providersAvailable: processedData?.summary.providers_available || 170,
    formattingIssues: processedData?.summary.formatting_issues || 59,
    missingNpi: processedData?.summary.missing_npi || 510,
    finalRecords: processedData?.summary.final_records || 510,
    outliersRemoved: processedData?.summary.outliers_removed || 0,
  }

  const dataQualityWidth = Math.min(Math.round(metrics.dataQualityScore), 100)
  const availabilityPercent = metrics.totalProviders
    ? Math.min(Math.round((metrics.providersAvailable / metrics.totalProviders) * 100), 100)
    : 0
  const expiredPercentValue = Math.min(Number(metrics.expiredLicensesPercent) || 0, 100)
  const compliancePercent = Math.min(Math.round(metrics.complianceRate), 100)

  return (
    <div className="relative min-h-screen overflow-hidden bg-background">
      <div className="pointer-events-none absolute inset-x-0 -top-40 h-80 bg-[radial-gradient(circle_at_top,_rgba(132,112,255,0.18),_transparent_60%)]" />
      <div className="pointer-events-none absolute inset-x-0 top-36 h-[420px] bg-[radial-gradient(circle_at_top,_rgba(103,191,255,0.12),_transparent_70%)]" />
      <div className="relative z-10 flex min-h-screen overflow-hidden">
        {/* Left Sidebar */}
        <Sidebar />

        {/* Main Content */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Header */}
          <header className="flex-shrink-0 px-6 pt-6 pb-4">
            <div className="rounded-3xl border border-indigo-100/60 bg-white/85 shadow-lg shadow-indigo-200/30 backdrop-blur supports-[backdrop-filter]:bg-white/70 dark:border-slate-800/60 dark:bg-slate-900/75">
              <div className="flex flex-wrap items-start justify-between gap-6 px-6 py-5">
                <div className="flex flex-col gap-4">
                  <div className="flex flex-wrap items-center gap-3">
                    <Badge variant="secondary" className="rounded-full bg-indigo-100 text-indigo-700 dark:bg-indigo-500/20 dark:text-indigo-200">
                      MCHECK PROVIDER ANALYTICS
                    </Badge>
                    <span className="inline-flex items-center gap-2 rounded-full bg-emerald-100 px-3 py-1 text-xs font-medium text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-200">
                      <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-500" />
                      Real-time validation active
                    </span>
                    <span className="text-xs text-muted-foreground">Updated {new Date().toLocaleTimeString()}</span>
                  </div>
                  <div className="space-y-2">
                    <h1 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
                      Unified clinical data performance snapshot
                    </h1>
                    <p className="max-w-2xl text-sm text-muted-foreground">
                      Monitor compliance, license expirations, and provider availability at a glance. Surface issues faster with AI-assisted workflows and real-time validation telemetry.
                    </p>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-3 sm:flex-row sm:items-center">
                  <div className="flex items-center gap-2 self-end sm:self-auto">
                    <Select defaultValue="30d">
                      <SelectTrigger className="w-36 rounded-full border-indigo-100 bg-white/80 text-sm font-medium shadow-sm dark:border-slate-700 dark:bg-slate-900/80">
                        <SelectValue placeholder="Last 30 days" />
                      </SelectTrigger>
                      <SelectContent className="rounded-xl border-indigo-100/80 bg-white dark:border-slate-700 dark:bg-slate-900">
                        <SelectItem value="7d">Last 7 days</SelectItem>
                        <SelectItem value="14d">Last 14 days</SelectItem>
                        <SelectItem value="30d">Last 30 days</SelectItem>
                        <SelectItem value="90d">Last quarter</SelectItem>
                      </SelectContent>
                    </Select>
                    <ThemeToggle />
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    <Link href="/analytics/providers">
                      <Button
                        size="sm"
                        variant="outline"
                        className="rounded-full border-indigo-200/70 bg-white/80 text-indigo-700 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md dark:border-slate-700 dark:bg-slate-900/80 dark:text-indigo-200"
                      >
                        <Users className="mr-2 h-4 w-4" />
                        All providers
                      </Button>
                    </Link>
                    <Link href="/analytics/duplicates">
                      <Button
                        size="sm"
                        variant="outline"
                        className="rounded-full border-amber-200/70 bg-white/80 text-amber-600 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md dark:border-amber-500/30 dark:bg-slate-900/80 dark:text-amber-200"
                      >
                        <AlertTriangle className="mr-2 h-4 w-4" />
                        Duplication analysis
                      </Button>
                    </Link>
                    <Link href="/analytics/ai-chat">
                      <Button className="rounded-full bg-gradient-to-r from-indigo-500 via-purple-500 to-sky-500 text-white shadow-lg shadow-indigo-300/40 transition hover:-translate-y-0.5 hover:from-indigo-600 hover:via-purple-600 hover:to-sky-600">
                        <Bot className="mr-2 h-4 w-4" />
                        Ask AI assistant
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </header>

          <div className="flex-1 flex overflow-hidden">
            {/* Main Dashboard Content */}
            <div className="flex-1 space-y-6 overflow-y-auto px-6 pb-10">
              {/* Key Healthcare Metrics */}
              <div className="grid grid-cols-1 gap-4 md:grid-cols-5">
                <Card className="relative overflow-hidden border border-indigo-100/70 bg-white/85 backdrop-blur-sm shadow-sm transition hover:-translate-y-0.5 hover:shadow-md dark:border-slate-800/60 dark:bg-slate-900/75">
                  <span className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-sky-500" />
                  <CardContent className="space-y-3 p-5">
                    <div className="text-sm font-semibold text-indigo-600 dark:text-indigo-300">Data quality score</div>
                    <div className="flex items-baseline gap-2">
                      <span className="text-2xl font-bold text-foreground">{metrics.dataQualityScore}%</span>
                      <span className="rounded-full bg-indigo-100 px-2 py-0.5 text-[11px] font-medium uppercase tracking-wide text-indigo-700 dark:bg-indigo-500/20 dark:text-indigo-200">
                        {metrics.dataQualityScore >= 90 ? "Excellent" : metrics.dataQualityScore >= 80 ? "Stable" : "Monitor"}
                      </span>
                    </div>
                    <div className="mt-4 space-y-2">
                      <div className="flex items-center justify-between text-[11px] uppercase tracking-wide text-muted-foreground">
                        <span>Target 90%</span>
                        <span>{dataQualityWidth}%</span>
                      </div>
                      <div className="h-2 w-full rounded-full bg-muted/60">
                        <div
                          className="h-2 rounded-full bg-gradient-to-r from-indigo-500 via-purple-500 to-sky-500"
                          style={{ width: `${dataQualityWidth}%` }}
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="relative overflow-hidden border border-indigo-100/70 bg-white/85 backdrop-blur-sm shadow-sm transition hover:-translate-y-0.5 hover:shadow-md dark:border-slate-800/60 dark:bg-slate-900/75">
                  <span className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-sky-500 via-cyan-500 to-indigo-500" />
                  <CardContent className="space-y-3 p-5">
                    <div className="text-sm font-semibold text-sky-600 dark:text-sky-300">Total providers</div>
                    <div className="text-2xl font-bold text-foreground">{metrics.totalProviders.toLocaleString()}</div>
                    <p className="text-xs text-muted-foreground">Active in network • {metrics.finalRecords.toLocaleString()} clean profiles</p>
                    <div className="rounded-full bg-sky-100 px-2 py-0.5 text-[11px] font-medium uppercase tracking-wide text-sky-700 dark:bg-sky-500/20 dark:text-sky-200">
                      {metrics.candidatePairs.toLocaleString()} candidate pairs reviewed
                    </div>
                  </CardContent>
                </Card>

                <Card className="relative overflow-hidden border border-indigo-100/70 bg-white/85 backdrop-blur-sm shadow-sm transition hover:-translate-y-0.5 hover:shadow-md dark:border-slate-800/60 dark:bg-slate-900/75">
                  <span className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-emerald-400 via-emerald-500 to-sky-500" />
                  <CardContent className="space-y-3 p-5">
                    <div className="text-sm font-semibold text-emerald-600 dark:text-emerald-300">Providers available</div>
                    <div className="flex items-baseline gap-2">
                      <span className="text-2xl font-bold text-foreground">{metrics.providersAvailable}</span>
                      <span className="text-xs text-muted-foreground">of {metrics.totalProviders.toLocaleString()}</span>
                    </div>
                    <div className="mt-4 space-y-2">
                      <div className="flex items-center justify-between text-[11px] uppercase tracking-wide text-muted-foreground">
                        <span>Active slots</span>
                        <span>{availabilityPercent}%</span>
                      </div>
                      <div className="h-2 w-full rounded-full bg-muted/60">
                        <div
                          className="h-2 rounded-full bg-gradient-to-r from-emerald-400 via-emerald-500 to-sky-500"
                          style={{ width: `${availabilityPercent}%` }}
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="relative overflow-hidden border border-indigo-100/70 bg-white/85 backdrop-blur-sm shadow-sm transition hover:-translate-y-0.5 hover:shadow-md dark:border-slate-800/60 dark:bg-slate-900/75">
                  <span className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-purple-500 via-indigo-500 to-cyan-500" />
                  <CardContent className="space-y-3 p-5">
                    <div className="text-sm font-semibold text-purple-600 dark:text-purple-300">Compliance rate</div>
                    <div className="flex items-baseline gap-2">
                      <span className="text-2xl font-bold text-foreground">{metrics.complianceRate}%</span>
                      <span className="rounded-full bg-purple-100 px-2 py-0.5 text-[11px] font-medium uppercase tracking-wide text-purple-700 dark:bg-purple-500/20 dark:text-purple-200">
                        {metrics.complianceRate >= 50 ? "Above target" : "Below target"}
                      </span>
                    </div>
                    <div className="mt-4 space-y-2">
                      <div className="flex items-center justify-between text-[11px] uppercase tracking-wide text-muted-foreground">
                        <span>Goal 75%</span>
                        <span>{Math.min(compliancePercent, 100)}%</span>
                      </div>
                      <div className="h-2 w-full rounded-full bg-muted/60">
                        <div
                          className="h-2 rounded-full bg-gradient-to-r from-purple-500 via-indigo-500 to-cyan-500"
                          style={{ width: `${Math.min(compliancePercent, 100)}%` }}
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="relative overflow-hidden border border-indigo-100/70 bg-white/85 backdrop-blur-sm shadow-sm transition hover:-translate-y-0.5 hover:shadow-md dark:border-slate-800/60 dark:bg-slate-900/75">
                  <span className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-amber-400 via-orange-500 to-rose-500" />
                  <CardContent className="space-y-3 p-5">
                    <div className="text-sm font-semibold text-amber-600 dark:text-amber-300">Expired licenses</div>
                    <div className="flex items-baseline gap-2">
                      <span className="text-2xl font-bold text-foreground">{metrics.expiredLicensesPercent}%</span>
                      <span className="text-xs text-muted-foreground">
                        {metrics.expiredLicensesCount} providers
                      </span>
                    </div>
                    <div className="mt-4 space-y-2">
                      <div className="flex items-center justify-between text-[11px] uppercase tracking-wide text-muted-foreground">
                        <span>Remediation</span>
                        <span>{expiredPercentValue}%</span>
                      </div>
                      <div className="h-2 w-full rounded-full bg-muted/60">
                        <div
                          className="h-2 rounded-full bg-gradient-to-r from-amber-400 via-orange-500 to-rose-500"
                          style={{ width: `${expiredPercentValue}%` }}
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Data Summary Section */}
              <Card className="relative overflow-hidden border border-indigo-200/60 bg-gradient-to-r from-indigo-50 via-sky-50 to-purple-50 dark:border-slate-800/60 dark:from-indigo-900/40 dark:via-slate-900/60 dark:to-purple-900/40">
                <span className="absolute right-6 top-6 h-14 w-14 rounded-full bg-gradient-to-br from-indigo-200 via-purple-200 to-sky-200 opacity-60 blur-xl dark:from-indigo-600/40 dark:via-purple-600/40 dark:to-sky-600/40" />
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold mb-3 flex items-center">
                        <FileText className="w-5 h-5 mr-2 text-indigo-600 dark:text-indigo-300" />
                        Data Summary & Insights
                      </h3>
                      <div className="prose prose-sm text-muted-foreground mb-4 max-w-none">
                        <p className="mb-2">
                          Your provider network currently has <strong className="text-foreground">{metrics.totalProviders.toLocaleString()} total providers</strong> with 
                          a <strong className="text-foreground">{metrics.dataQualityScore}% data quality score</strong>. Key areas requiring attention include:
                        </p>
                        <ul className="list-disc list-inside space-y-1 text-sm">
                          <li><strong className="text-foreground">{metrics.expiredLicensesPercent}%</strong> of providers have expired licenses ({metrics.expiredLicensesCount} providers)</li>
                          <li><strong className="text-foreground">{metrics.missingNpi.toLocaleString()}</strong> providers are missing NPI numbers</li>
                          <li><strong className="text-foreground">{metrics.formattingIssues}</strong> providers have formatting issues in their contact information</li>
                          <li>Current compliance rate stands at <strong className="text-foreground">{metrics.complianceRate}%</strong></li>
                        </ul>
                        <p className="mt-3 text-sm">
                          The system has identified <strong className="text-foreground">{metrics.totalClusters} duplicate clusters</strong> affecting 
                          <strong className="text-foreground"> {metrics.uniqueInvolved} providers</strong>, with <strong className="text-foreground">{metrics.providersAvailable}</strong> providers 
                          currently available for patient scheduling.
                        </p>
                      </div>
                    </div>
                    <div className="ml-6 flex flex-col items-end space-y-3">
                      <Link href="/analytics/ai-chat">
                        <Button size="lg" className="rounded-full bg-gradient-to-r from-indigo-500 via-purple-500 to-sky-500 text-white shadow-lg shadow-indigo-300/40 transition hover:-translate-y-0.5 hover:from-indigo-600 hover:via-purple-600 hover:to-sky-600">
                          <Bot className="w-5 h-5 mr-2" />
                          Chat for More Details
                        </Button>
                      </Link>
                      <p className="text-xs text-muted-foreground text-center max-w-[200px]">
                        Get AI-powered insights and detailed analysis of your provider data
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Charts */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center font-heading">
                      <BarChart3 className="w-5 h-5 mr-2" />
                      Provider Distribution by State
                    </CardTitle>
                    <CardDescription>
                      Geographic distribution of healthcare providers across states
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Suspense fallback={<div className="h-[300px] bg-muted animate-pulse rounded" />}>
                      <ProvidersByStateChart />
                    </Suspense>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center font-heading">
                      <PieChart className="w-5 h-5 mr-2" />
                      Provider Distribution by Specialty
                    </CardTitle>
                    <CardDescription>
                      Interactive view of provider count and data quality issues across medical specialties
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Suspense fallback={<div className="h-[300px] bg-muted animate-pulse rounded" />}>
                      <IssuesBySpecialtyChart />
                    </Suspense>
                  </CardContent>
                </Card>
              </div>

              {/* Experience Distribution Chart */}
              <Card className="border border-indigo-100/70 bg-white/85 backdrop-blur-sm dark:border-slate-800/60 dark:bg-slate-900/75">
                <CardHeader>
                  <CardTitle className="flex items-center font-heading">
                    <BarChart3 className="w-5 h-5 mr-2" />
                    Provider Experience Distribution by Specialty
                  </CardTitle>
                  <CardDescription>
                    Box plot showing the distribution of years in practice across different medical specialties
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Suspense fallback={<div className="h-[400px] bg-muted animate-pulse rounded" />}>
                    <SpecialtyExperienceChart />
                  </Suspense>
                </CardContent>
              </Card>

              {/* Records with Most Issues */}
              {/* <Card>
                <CardHeader>
                  <CardTitle className="font-heading">Records with Most Issues</CardTitle>
                  <CardDescription>Providers requiring immediate attention</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {recordsWithIssues.map((record) => (
                      <div key={record.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center space-x-4">
                          <div
                            className={`w-3 h-3 rounded-full ${
                              record.riskLevel === "high"
                                ? "bg-red-500"
                                : record.riskLevel === "medium"
                                  ? "bg-yellow-500"
                                  : "bg-green-500"
                            }`}
                          />
                          <div>
                            <div className="font-medium">{record.name}</div>
                            <div className="text-sm text-muted-foreground">
                              {record.specialty} • {record.id}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-3">
                          <div className="flex flex-wrap gap-1">
                            {record.issues.map((issue, index) => (
                              <Badge key={index} variant="outline" className="text-xs">
                                {issue}
                              </Badge>
                            ))}
                          </div>
                          <Badge variant={record.riskLevel === "high" ? "destructive" : "secondary"}>
                            {record.issueCount} issues
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card> */}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { ArrowLeft, Calendar, Share2, Download, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { loadReports } from "@/data/reports/loadReports";

const MiniReportPost = () => {
  const { id } = useParams<{ id: string }>();
  const [report, setReport] = useState<any>(null);

  useEffect(() => {
    loadReports().then((allReports) => {
      const found = allReports.find((r) => r.id === id);
      setReport(found);
    });
  }, [id]);

  if (!report) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <h1 className="text-2xl font-mono font-medium mb-4">Report Not Found</h1>
        <p className="mb-8 text-muted-foreground">The mini-report you're looking for doesn't exist.</p>
        <Button asChild>
          <Link to="/mini-reports">Back to Reports</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-6">
        <Link to="/mini-reports" className="inline-flex items-center text-sm hover:underline text-muted-foreground">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Mini-Reports
        </Link>
      </div>

      <article>
        <header className="mb-8">
          <h1 className="text-4xl font-mono font-bold tracking-tight leading-tight mb-4">{report.title}</h1>

          <div className="flex flex-wrap gap-4 items-center text-sm text-muted-foreground mb-3">
            <div className="flex items-center gap-1">
              <Calendar className="h-4 w-4 text-blue-500" />
              <span>{report.date}</span>
            </div>
            {report.readTime && (
              <div className="flex items-center gap-1">
                <BookOpen className="h-4 w-4 text-purple-500" />
                <span>{report.readTime}</span>
              </div>
            )}
            {report.downloads !== undefined && (
              <div className="flex items-center gap-1">
                <Download className="h-4 w-4 text-emerald-500" />
                <span>{report.downloads} downloads</span>
              </div>
            )}
          </div>

          <div className="flex flex-wrap gap-2 mb-4">
            {report.tags?.map((tag: string) => (
              <Badge key={tag} variant="secondary" className="uppercase tracking-wide text-xs">
                {tag}
              </Badge>
            ))}
          </div>

          <div className="bg-muted/20 border border-border rounded-md p-4 text-sm text-muted-foreground font-medium leading-relaxed mb-6">
            {report.description}
          </div>
        </header>

        <div
          className="prose prose-invert prose-lg max-w-none leading-7"
          dangerouslySetInnerHTML={{ __html: report.content }}
        />

        <div className="mt-12">
          <Separator className="my-6" />
          <div className="flex flex-wrap justify-between items-center gap-4">
            <p className="text-sm italic text-muted-foreground">
              Prepared by: <span className="not-italic">{report.author || "CCTIC Research Unit"}</span>
            </p>
            <div className="flex gap-2">
              <Button size="sm" variant="outline" className="flex items-center gap-2">
                <Download className="h-4 w-4" />
                Download PDF
              </Button>
              <Button size="sm" variant="outline" className="flex items-center gap-2">
                <Share2 className="h-4 w-4" />
                Share
              </Button>
            </div>
          </div>
        </div>
      </article>
    </div>
  );
};

export default MiniReportPost;

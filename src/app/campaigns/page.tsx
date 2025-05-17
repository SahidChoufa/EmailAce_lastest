
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PlusCircle, Send, CheckCircle, XCircle, AlertTriangle, FileText } from "lucide-react";
import type { Campaign } from "@/types"; // Assuming types are defined

// Mock data
const mockCampaigns: Campaign[] = [
  { 
    id: "1", 
    name: "Frontend Developer Outreach Q3", 
    candidateId: "1", 
    emailListId: "1", 
    templateId: "1", 
    status: "sent", 
    createdAt: new Date(2023, 8, 15), 
    updatedAt: new Date(2023, 8, 16),
    sentEmails: [
      { id: "se1", recipientEmail: "hr@companyA.com", sentAt: new Date(), status: "delivered", replyCategory: "Yes", replySummary: "Interested in an interview." },
      { id: "se2", recipientEmail: "jobs@companyB.com", sentAt: new Date(), status: "delivered", replyCategory: "No", replySummary: "Position filled." },
    ]
  },
  { 
    id: "2", 
    name: "Product Manager Hunt", 
    candidateId: "2", 
    emailListId: "2", 
    templateId: "2", 
    status: "draft", 
    createdAt: new Date(2023, 9, 1), 
    updatedAt: new Date(2023, 9, 1),
    sentEmails: []
  },
];

const StatusIcon = ({ status }: { status: Campaign["status"] }) => {
  if (status === "sent") return <CheckCircle className="h-4 w-4 text-green-500" />;
  if (status === "draft") return <FileText className="h-4 w-4 text-yellow-500" />;
  if (status === "failed") return <XCircle className="h-4 w-4 text-red-500" />;
  return <AlertTriangle className="h-4 w-4 text-muted-foreground" />;
};


export default function CampaignsPage() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Manage Campaigns
          </h1>
          <p className="text-muted-foreground">
            Launch new email campaigns and track their progress.
          </p>
        </div>
        <Link href="/campaigns/new" passHref>
          <Button>
            <PlusCircle className="mr-2 h-4 w-4" /> New Campaign
          </Button>
        </Link>
      </div>

      {mockCampaigns.length === 0 ? (
        <Card className="flex flex-col items-center justify-center py-12">
          <CardHeader className="items-center">
            <Send className="h-12 w-12 text-muted-foreground mb-4" />
            <CardTitle>No Campaigns Yet</CardTitle>
            <CardDescription>Start your first email campaign to reach out to employers.</CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/campaigns/new" passHref>
              <Button>
                <PlusCircle className="mr-2 h-4 w-4" /> New Campaign
              </Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
         <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {mockCampaigns.map(campaign => (
            <Card key={campaign.id}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <CardTitle>{campaign.name}</CardTitle>
                  <StatusIcon status={campaign.status} />
                </div>
                <CardDescription>
                  Status: <span className="capitalize">{campaign.status}</span>. Created: {campaign.createdAt.toLocaleDateString()}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  {campaign.sentEmails.length} emails sent.
                  {campaign.status === "sent" && ` ${campaign.sentEmails.filter(e => e.replyCategory === "Yes").length} positive replies.`}
                </p>
                <div className="mt-4 flex gap-2">
                  <Button variant="outline" size="sm" asChild>
                    <Link href={`/campaigns/${campaign.id}`}>View Details</Link>
                  </Button>
                   {campaign.status === "draft" && (
                    <Button variant="default" size="sm" asChild>
                       <Link href={`/campaigns/${campaign.id}/edit`}>Edit</Link>
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}


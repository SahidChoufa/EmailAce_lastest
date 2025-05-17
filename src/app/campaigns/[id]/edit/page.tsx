import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import CampaignForm from "@/components/forms/CampaignForm";

interface EditCampaignPageProps {
  params: { id: string };
}

export default function EditCampaignPage({ params }: EditCampaignPageProps) {
  const campaignId = params.id;
  // Mock data for now - in a real app, fetch this from Supabase
  const mockData = {
    name: "Tech Companies Q2",
    candidate_id: "1",
    email_list_id: "1",
    template_id: "1",
    job_description: "Looking for a skilled developer..."
  };

  return (
    <div className="flex flex-col gap-6 max-w-3xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          Edit Campaign
        </h1>
        <p className="text-muted-foreground">
          Modify campaign details for ID: {campaignId}
        </p>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Campaign Details</CardTitle>
          <CardDescription>Update the campaign configuration.</CardDescription>
        </CardHeader>
        <CardContent>
          <CampaignForm id={campaignId} initialData={mockData} />
        </CardContent>
      </Card>
    </div>
  );
}
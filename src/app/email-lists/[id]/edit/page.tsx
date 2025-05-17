import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import EmailListForm from "@/components/forms/EmailListForm";

interface EditEmailListPageProps {
  params: { id: string };
}

export default function EditEmailListPage({ params }: EditEmailListPageProps) {
  const listId = params.id;
  // In a real app, fetch email list data using listId
  const mockData = {
    name: "Tech Companies",
    emails: ["hr@company.com", "jobs@startup.com"]
  };

  return (
    <div className="flex flex-col gap-6 max-w-2xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          Edit Email List
        </h1>
        <p className="text-muted-foreground">
          Modify the details for email list ID: {listId}.
        </p>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Email List Details</CardTitle>
          <CardDescription>Update the name and email addresses for this list.</CardDescription>
        </CardHeader>
        <CardContent>
          <EmailListForm initialData={mockData} />
        </CardContent>
      </Card>
    </div>
  );
}
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import EmailListForm from "@/components/forms/EmailListForm";

export default function NewEmailListPage() {
  return (
    <div className="flex flex-col gap-6 max-w-2xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          Create New Email List
        </h1>
        <p className="text-muted-foreground">
          Define a new list of email addresses for your campaigns.
        </p>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Email List Details</CardTitle>
          <CardDescription>Provide a name and add email addresses to the list.</CardDescription>
        </CardHeader>
        <CardContent>
          <EmailListForm />
        </CardContent>
      </Card>
    </div>
  );
}
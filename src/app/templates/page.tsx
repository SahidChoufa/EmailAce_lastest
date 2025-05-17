
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PlusCircle, FileText } from "lucide-react";

// Mock data
const mockTemplates = [
  { id: "1", name: "Initial Outreach", subjectTemplate: "Application for [Job Title]", createdAt: new Date() },
  { id: "2", name: "Follow-up Email", subjectTemplate: "Following up on my application", createdAt: new Date() },
];

export default function TemplatesPage() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Manage Email Templates
          </h1>
          <p className="text-muted-foreground">
            Create, view, and edit your email templates.
          </p>
        </div>
        <Link href="/templates/new" passHref>
          <Button>
            <PlusCircle className="mr-2 h-4 w-4" /> Add Template
          </Button>
        </Link>
      </div>

       {mockTemplates.length === 0 ? (
        <Card className="flex flex-col items-center justify-center py-12">
          <CardHeader className="items-center">
            <FileText className="h-12 w-12 text-muted-foreground mb-4" />
            <CardTitle>No Templates Yet</CardTitle>
            <CardDescription>Create your first email template to personalize your applications.</CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/templates/new" passHref>
              <Button>
                <PlusCircle className="mr-2 h-4 w-4" /> Add Template
              </Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
         <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {mockTemplates.map(template => (
            <Card key={template.id}>
              <CardHeader>
                <CardTitle>{template.name}</CardTitle>
                <CardDescription>Created: {template.createdAt.toLocaleDateString()}</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">Subject: {template.subjectTemplate}</p>
                <div className="mt-4 flex gap-2">
                  <Button variant="outline" size="sm" asChild>
                    <Link href={`/templates/${template.id}/edit`}>Edit</Link>
                  </Button>
                  <Button variant="destructive" size="sm">Delete</Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

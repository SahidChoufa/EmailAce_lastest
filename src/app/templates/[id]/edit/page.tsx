
// import TemplateForm from "@/components/forms/TemplateForm"; // Will be created later
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface EditTemplatePageProps {
  params: { id: string };
}

export default function EditTemplatePage({ params }: EditTemplatePageProps) {
  const templateId = params.id;

  return (
    <div className="flex flex-col gap-6 max-w-2xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          Edit Email Template
        </h1>
        <p className="text-muted-foreground">
          Modify the template with ID: {templateId}.
        </p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Template Details</CardTitle>
          <CardDescription>Update the subject and body for this email template.</CardDescription>
        </CardHeader>
        <CardContent>
          {/* <TemplateForm templateId={templateId} /> */}
          <p className="text-center text-muted-foreground py-8">Template edit form for ID: {templateId} will be here.</p>
        </CardContent>
      </Card>
    </div>
  );
}

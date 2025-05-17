import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import TemplateForm from "@/components/forms/TemplateForm";
import { supabase } from '@/lib/supabase';
import { notFound } from 'next/navigation';

interface EditTemplatePageProps {
  params: { id: string };
}

async function getTemplate(id: string) {
  const { data: template, error } = await supabase
    .from('email_templates')
    .select('*')
    .eq('id', id)
    .single();

  if (error || !template) return null;
  return template;
}

export default async function EditTemplatePage({ params }: EditTemplatePageProps) {
  const template = await getTemplate(params.id);
  
  if (!template) {
    notFound();
  }

  return (
    <div className="flex flex-col gap-6 max-w-2xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          Edit Email Template
        </h1>
        <p className="text-muted-foreground">
          Update the details for {template.name}.
        </p>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Template Details</CardTitle>
          <CardDescription>Update the subject and body for this email template.</CardDescription>
        </CardHeader>
        <CardContent>
          <TemplateForm id={params.id} initialData={template} />
        </CardContent>
      </Card>
    </div>
  );
}
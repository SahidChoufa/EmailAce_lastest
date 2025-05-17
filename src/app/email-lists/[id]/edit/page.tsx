import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import EmailListForm from "@/components/forms/EmailListForm";
import { supabase } from '@/lib/supabase';
import { notFound } from 'next/navigation';

interface EditEmailListPageProps {
  params: { id: string };
}

async function getEmailList(id: string) {
  const { data: emailList, error } = await supabase
    .from('email_lists')
    .select('*')
    .eq('id', id)
    .single();

  if (error || !emailList) return null;
  return emailList;
}

export default async function EditEmailListPage({ params }: EditEmailListPageProps) {
  const emailList = await getEmailList(params.id);
  
  if (!emailList) {
    notFound();
  }

  return (
    <div className="flex flex-col gap-6 max-w-2xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          Edit Email List
        </h1>
        <p className="text-muted-foreground">
          Update the details for {emailList.name}.
        </p>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Email List Details</CardTitle>
          <CardDescription>Update the name and email addresses for this list.</CardDescription>
        </CardHeader>
        <CardContent>
          <EmailListForm id={params.id} initialData={emailList} />
        </CardContent>
      </Card>
    </div>
  );
}
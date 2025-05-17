import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PlusCircle, ListChecks } from "lucide-react";
import { supabase } from '@/lib/supabase';

async function getEmailLists() {
  const { data: lists, error } = await supabase
    .from('email_lists')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return lists;
}

export default async function EmailListsPage() {
  const emailLists = await getEmailLists();

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Manage Email Lists
          </h1>
          <p className="text-muted-foreground">
            Create, view, and edit lists of employer email addresses.
          </p>
        </div>
        <Link href="/email-lists/new" passHref>
          <Button>
            <PlusCircle className="mr-2 h-4 w-4" /> Add Email List
          </Button>
        </Link>
      </div>

      {emailLists.length === 0 ? (
        <Card className="flex flex-col items-center justify-center py-12">
          <CardHeader className="items-center">
            <ListChecks className="h-12 w-12 text-muted-foreground mb-4" />
            <CardTitle>No Email Lists Yet</CardTitle>
            <CardDescription>Create your first email list to start sending campaigns.</CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/email-lists/new" passHref>
              <Button>
                <PlusCircle className="mr-2 h-4 w-4" /> Add Email List
              </Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {emailLists.map(list => (
            <Card key={list.id}>
              <CardHeader>
                <CardTitle>{list.name}</CardTitle>
                <CardDescription>{list.emails.length} emails. Created: {new Date(list.created_at).toLocaleDateString()}</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground truncate">
                  {list.emails.join(', ')}
                </p>
                <div className="mt-4 flex gap-2">
                  <Button variant="outline" size="sm" asChild>
                    <Link href={`/email-lists/${list.id}/edit`}>Edit</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
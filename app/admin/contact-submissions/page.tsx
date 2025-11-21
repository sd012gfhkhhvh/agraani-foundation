'use client';

import { PermissionGate } from '@/components/admin/PermissionGate';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { EmptyState } from '@/components/ui/empty-state';
import { LoadingCard } from '@/components/ui/loading';
import {
  deleteContactSubmission,
  getContactSubmissions,
  markSubmissionAsRead,
} from '@/lib/actions';
import { usePermissions } from '@/lib/hooks/usePermissions';
import { Resource } from '@/lib/permissions';
import { showError, showPromiseToast } from '@/lib/toast-utils';
import { Calendar, Eye, Mail, Phone, Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react';

interface ContactSubmission {
  id: string;
  name: string;
  email: string;
  phone?: string | null;
  subject?: string | null;
  message: string;
  isRead: boolean;
  createdAt: Date | string;
}

function formatDate(date: Date | string): string {
  return new Intl.DateTimeFormat('en-IN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(date));
}

export default function ContactSubmissionsPage() {
  const [submissions, setSubmissions] = useState<ContactSubmission[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'unread'>('unread');

  const permissions = usePermissions(Resource.CONTACT_SUBMISSIONS);

  useEffect(() => {
    fetchSubmissions();
  }, []);

  const fetchSubmissions = async () => {
    setIsLoading(true);
    const result = await getContactSubmissions();
    if (result.success && result.data) {
      setSubmissions(result.data);
    } else {
      showError('Failed to load contact submissions');
    }
    setIsLoading(false);
  };

  const handleMarkAsRead = async (id: string) => {
    const result = await showPromiseToast(markSubmissionAsRead(id, true), {
      loading: 'Marking as read...',
      success: 'Marked as read!',
      error: 'Failed to mark as read',
    });

    if (result.success) {
      await fetchSubmissions();
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this submission?')) return;

    const result = await showPromiseToast(deleteContactSubmission(id), {
      loading: 'Deleting...',
      success: 'Submission deleted!',
      error: 'Failed to delete submission',
    });

    if (result.success) {
      await fetchSubmissions();
    }
  };

  const filteredSubmissions =
    filter === 'unread' ? submissions.filter((s) => !s.isRead) : submissions;

  if (isLoading) {
    return <LoadingCard />;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gradient-primary">Contact Submissions</h1>
          <p className="text-muted-foreground mt-1">View and manage contact form submissions</p>
        </div>
        <div className="flex gap-2">
          <Button
            variant={filter === 'unread' ? 'default' : 'outline'}
            onClick={() => setFilter('unread')}
          >
            Unread ({submissions.filter((s) => !s.isRead).length})
          </Button>
          <Button
            variant={filter === 'all' ? 'default' : 'outline'}
            onClick={() => setFilter('all')}
          >
            All ({submissions.length})
          </Button>
        </div>
      </div>

      {filteredSubmissions.length === 0 ? (
        <EmptyState
          icon={Mail}
          title={filter === 'unread' ? 'No unread submissions' : 'No submissions yet'}
          description={
            filter === 'unread'
              ? 'All submissions have been read'
              : 'No one has submitted the contact form yet'
          }
        />
      ) : (
        <div className="space-y-4">
          {filteredSubmissions.map((submission) => (
            <Card
              key={submission.id}
              className={`card-hover ${submission.isRead ? 'opacity-60' : 'border-l-4 border-l-primary'}`}
            >
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-semibold text-lg">{submission.name}</h3>
                      {!submission.isRead && <Badge className="bg-primary text-white">New</Badge>}
                    </div>
                    <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Mail className="h-4 w-4" />
                        <a href={`mailto:${submission.email}`} className="hover:text-primary">
                          {submission.email}
                        </a>
                      </span>
                      {submission.phone && (
                        <span className="flex items-center gap-1">
                          <Phone className="h-4 w-4" />
                          <a href={`tel:${submission.phone}`} className="hover:text-primary">
                            {submission.phone}
                          </a>
                        </span>
                      )}
                      <span className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        {formatDate(submission.createdAt)}
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    {!submission.isRead && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleMarkAsRead(submission.id)}
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        Mark Read
                      </Button>
                    )}
                    <PermissionGate resource={Resource.CONTACT_SUBMISSIONS} action="delete">
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleDelete(submission.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </PermissionGate>
                  </div>
                </div>

                {submission.subject && (
                  <div className="mb-3">
                    <span className="font-medium text-sm">Subject: </span>
                    <span className="text-sm">{submission.subject}</span>
                  </div>
                )}

                <div className="bg-muted/50 p-4 rounded-lg">
                  <p className="text-sm whitespace-pre-wrap">{submission.message}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

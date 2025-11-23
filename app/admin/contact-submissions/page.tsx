'use client';

import { AdminCard } from '@/components/admin/AdminCard';
import { AdminPageHeader } from '@/components/admin/AdminPageHeader';
import { DeleteDialog } from '@/components/admin/DeleteDialog';
import { PermissionGate } from '@/components/admin/PermissionGate';
import { Button } from '@/components/ui/button';
import { EmptyState } from '@/components/ui/empty-state';
import { LoadingCard } from '@/components/ui/loading';
import { deleteContactSubmission, markSubmissionAsRead } from '@/lib/actions';
import { useContactSubmissions } from '@/lib/hooks/useAdminData';
import { usePermissions } from '@/lib/hooks/usePermissions';
import { Resource } from '@/lib/permissions';
import { showPromiseToast } from '@/lib/toast-utils';
import { Calendar, Eye, Mail, Phone, Trash2 } from 'lucide-react';
import { useState } from 'react';

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
  const { data: submissions = [], isLoading, refetch } = useContactSubmissions();
  const [filter, setFilter] = useState<'all' | 'unread'>('unread');

  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const permissions = usePermissions(Resource.CONTACT_SUBMISSIONS);

  const handleMarkAsRead = async (id: string) => {
    const result = await showPromiseToast(markSubmissionAsRead(id, { isRead: true }), {
      loading: 'Marking as read...',
      success: 'Marked as read!',
      error: 'Failed to mark as read',
    });

    if (result.success) {
      await refetch();
    }
  };

  const handleDelete = (id: string) => {
    setDeleteId(id);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!deleteId) return;

    setIsDeleting(true);
    try {
      const result = await showPromiseToast(deleteContactSubmission(deleteId), {
        loading: 'Deleting...',
        success: 'Submission deleted!',
        error: 'Failed to delete submission',
      });

      if (result.success) {
        await refetch();
        setIsDeleteDialogOpen(false);
        setDeleteId(null);
      }
    } finally {
      setIsDeleting(false);
    }
  };

  const filteredSubmissions =
    filter === 'unread' ? submissions.filter((s) => !s.isRead) : submissions;

  if (isLoading) {
    return <LoadingCard />;
  }

  return (
    <div className="space-y-8 animate-fade-in">
      <AdminPageHeader
        title="Contact Submissions"
        description="View and manage contact form submissions"
        action={
          <div className="flex gap-2 bg-muted/50 p-1 rounded-lg">
            <Button
              size="sm"
              variant={filter === 'unread' ? 'default' : 'ghost'}
              onClick={() => setFilter('unread')}
              className={filter === 'unread' ? 'bg-white text-primary shadow-sm' : ''}
            >
              Unread ({submissions.filter((s) => !s.isRead).length})
            </Button>
            <Button
              size="sm"
              variant={filter === 'all' ? 'default' : 'ghost'}
              onClick={() => setFilter('all')}
              className={filter === 'all' ? 'bg-white text-primary shadow-sm' : ''}
            >
              All ({submissions.length})
            </Button>
          </div>
        }
      />

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
            <AdminCard
              key={submission.id}
              title={submission.name}
              subtitle={
                <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mt-1">
                  <span className="flex items-center gap-1.5">
                    <Mail className="h-3.5 w-3.5" />
                    <a
                      href={`mailto:${submission.email}`}
                      className="hover:text-primary transition-colors"
                    >
                      {submission.email}
                    </a>
                  </span>
                  {submission.phone && (
                    <span className="flex items-center gap-1.5">
                      <Phone className="h-3.5 w-3.5" />
                      <a
                        href={`tel:${submission.phone}`}
                        className="hover:text-primary transition-colors"
                      >
                        {submission.phone}
                      </a>
                    </span>
                  )}
                  <span className="flex items-center gap-1.5">
                    <Calendar className="h-3.5 w-3.5" />
                    {formatDate(submission.createdAt)}
                  </span>
                </div>
              }
              status={{
                isActive: !submission.isRead,
                activeText: 'New',
                inactiveText: 'Read',
              }}
              actions={
                <>
                  {!submission.isRead && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleMarkAsRead(submission.id)}
                      className="h-8"
                    >
                      <Eye className="h-4 w-4 mr-1.5" />
                      Mark Read
                    </Button>
                  )}
                  <PermissionGate resource={Resource.CONTACT_SUBMISSIONS} action="delete">
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleDelete(submission.id)}
                      className="h-8 w-8 p-0"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </PermissionGate>
                </>
              }
              className={
                submission.isRead ? 'opacity-75 hover:opacity-100' : 'border-l-4 border-l-primary'
              }
            >
              <div className="space-y-3">
                {submission.subject && (
                  <div className="flex items-center gap-2 text-sm font-medium">
                    <span className="text-muted-foreground">Subject:</span>
                    <span>{submission.subject}</span>
                  </div>
                )}
                <div className="bg-muted/30 p-4 rounded-lg border border-muted/50">
                  <p className="text-sm whitespace-pre-wrap leading-relaxed text-muted-foreground">
                    {submission.message}
                  </p>
                </div>
              </div>
            </AdminCard>
          ))}
        </div>
      )}

      <DeleteDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        onConfirm={confirmDelete}
        title="Delete Submission"
        description="Are you sure you want to delete this submission? This action cannot be undone."
        isLoading={isDeleting}
      />
    </div>
  );
}

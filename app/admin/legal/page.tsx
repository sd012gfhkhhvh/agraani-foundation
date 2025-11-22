'use client';

import { AdminCard } from '@/components/admin/AdminCard';
import { AdminDialog } from '@/components/admin/AdminDialog';
import { AdminPageHeader } from '@/components/admin/AdminPageHeader';
import { DeleteDialog } from '@/components/admin/DeleteDialog';
import { PermissionGate } from '@/components/admin/PermissionGate';
import { Button } from '@/components/ui/button';
import { EmptyState } from '@/components/ui/empty-state';
import { Input } from '@/components/ui/input';
import { LoadingCard } from '@/components/ui/loading';
import {
  createLegalDocument,
  deleteLegalDocument,
  getLegalDocuments,
  updateLegalDocument,
} from '@/lib/actions';
import { usePermissions } from '@/lib/hooks/usePermissions';
import { Resource } from '@/lib/permissions';
import { showError, showPromiseToast } from '@/lib/toast-utils';
import { Edit, Eye, FileText, Plus, Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react';

interface LegalDocument {
  id: string;
  name: string;
  documentType: string;
  registrationNumber: string;
  validity: string;
  issueDate: Date | string | null;
  expiryDate: Date | string | null;
  fileUrl?: string | null;
  notes?: string | null;
  order: number;
  createdAt: Date | string;
  updatedAt: Date | string;
}

export default function LegalDocumentsPage() {
  const [documents, setDocuments] = useState<LegalDocument[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentDoc, setCurrentDoc] = useState<Partial<LegalDocument>>({});
  const [isSaving, setIsSaving] = useState(false);
  const [viewingDoc, setViewingDoc] = useState<LegalDocument | null>(null);

  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const permissions = usePermissions(Resource.LEGAL_DOCUMENTS);

  useEffect(() => {
    fetchDocuments();
  }, []);

  const fetchDocuments = async () => {
    setIsLoading(true);
    const result = await getLegalDocuments();
    if (result.success && result.data) {
      setDocuments(result.data);
    } else {
      showError('Failed to load legal documents');
    }
    setIsLoading(false);
  };

  const handleOpenDialog = (doc?: LegalDocument) => {
    if (doc) {
      setCurrentDoc(doc);
    } else {
      setCurrentDoc({ order: documents.length });
    }
    setIsDialogOpen(true);
  };

  const handleSave = async () => {
    if (
      !currentDoc.name ||
      !currentDoc.documentType ||
      !currentDoc.registrationNumber ||
      !currentDoc.validity
    ) {
      showError('Please fill in all required fields');
      return;
    }

    setIsSaving(true);
    try {
      const promise = currentDoc.id
        ? updateLegalDocument(currentDoc.id, {
            name: currentDoc.name,
            documentType: currentDoc.documentType,
            registrationNumber: currentDoc.registrationNumber,
            validity: currentDoc.validity,
            issueDate: currentDoc.issueDate
              ? new Date(currentDoc.issueDate).toISOString()
              : undefined,
            expiryDate: currentDoc.expiryDate
              ? new Date(currentDoc.expiryDate).toISOString()
              : undefined,
            fileUrl: currentDoc.fileUrl ?? undefined,
            notes: currentDoc.notes ?? undefined,
            order: currentDoc.order,
          })
        : createLegalDocument({
            name: currentDoc.name,
            documentType: currentDoc.documentType,
            registrationNumber: currentDoc.registrationNumber,
            validity: currentDoc.validity,
            issueDate: currentDoc.issueDate
              ? new Date(currentDoc.issueDate).toISOString()
              : undefined,
            expiryDate: currentDoc.expiryDate
              ? new Date(currentDoc.expiryDate).toISOString()
              : undefined,
            fileUrl: currentDoc.fileUrl ?? undefined,
            notes: currentDoc.notes ?? undefined,
            order: currentDoc.order ?? documents.length,
          });

      const result = await showPromiseToast(promise, {
        loading: currentDoc.id ? 'Updating document...' : 'Creating document...',
        success: currentDoc.id ? 'Document updated!' : 'Document created!',
        error: 'Failed to save document',
      });

      if (result.success) {
        await fetchDocuments();
        setIsDialogOpen(false);
        setCurrentDoc({});
      }
    } finally {
      setIsSaving(false);
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
      const result = await showPromiseToast(deleteLegalDocument(deleteId), {
        loading: 'Deleting document...',
        success: 'Document deleted!',
        error: 'Failed to delete document',
      });

      if (result.success) {
        await fetchDocuments();
        setIsDeleteDialogOpen(false);
        setDeleteId(null);
      }
    } finally {
      setIsDeleting(false);
    }
  };

  if (isLoading) {
    return <LoadingCard />;
  }

  return (
    <div className="space-y-8 animate-fade-in">
      <AdminPageHeader
        title="Legal & Compliance"
        description="Manage organizational registrations and certifications"
        action={
          <PermissionGate resource={Resource.LEGAL_DOCUMENTS} action="create">
            <Button onClick={() => handleOpenDialog()} className="btn-gradient-primary">
              <Plus className="h-4 w-4 mr-2" />
              Add Document
            </Button>
          </PermissionGate>
        }
      />

      <div className="grid gap-4">
        {documents.length === 0 ? (
          <EmptyState
            icon={FileText}
            title="No legal documents yet"
            description="Add your first compliance document or certification"
            action={
              permissions.canCreate ? (
                <Button onClick={() => handleOpenDialog()} className="btn-gradient-primary">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Document
                </Button>
              ) : undefined
            }
          />
        ) : (
          documents.map((doc) => (
            <AdminCard
              key={doc.id}
              title={doc.name}
              subtitle={doc.documentType}
              actions={
                <>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setViewingDoc(doc)}
                    className="h-8 w-8 p-0"
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                  <PermissionGate resource={Resource.LEGAL_DOCUMENTS} action="update">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleOpenDialog(doc)}
                      className="h-8 w-8 p-0"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                  </PermissionGate>
                  <PermissionGate resource={Resource.LEGAL_DOCUMENTS} action="delete">
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleDelete(doc.id)}
                      className="h-8 w-8 p-0"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </PermissionGate>
                </>
              }
            >
              <div className="grid grid-cols-2 gap-2 text-sm text-muted-foreground">
                <p>
                  <span className="font-medium">Registration:</span>{' '}
                  <span className="font-mono">{doc.registrationNumber}</span>
                </p>
                <p>
                  <span className="font-medium">Validity:</span> {doc.validity}
                </p>
                {doc.expiryDate && (
                  <p>
                    <span className="font-medium">Expires:</span>{' '}
                    {new Date(doc.expiryDate).toLocaleDateString()}
                  </p>
                )}
              </div>
            </AdminCard>
          ))
        )}
      </div>

      {/* Edit/Create Dialog */}
      <AdminDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        title={currentDoc.id ? 'Edit Document' : 'Add New Document'}
        description={
          currentDoc.id
            ? 'Update document details below.'
            : 'Enter details for the new compliance document.'
        }
        onSave={handleSave}
        isLoading={isSaving}
        disabled={
          !currentDoc.name ||
          !currentDoc.documentType ||
          !currentDoc.registrationNumber ||
          !currentDoc.validity
        }
      >
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Document Name *</label>
            <Input
              value={currentDoc.name || ''}
              onChange={(e) => setCurrentDoc({ ...currentDoc, name: e.target.value })}
              placeholder="e.g., 80G Tax Exemption Certificate"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Document Type *</label>
            <Input
              value={currentDoc.documentType || ''}
              onChange={(e) => setCurrentDoc({ ...currentDoc, documentType: e.target.value })}
              placeholder="e.g., 80G, FCRA, 12A"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Registration Number *</label>
            <Input
              value={currentDoc.registrationNumber || ''}
              onChange={(e) => setCurrentDoc({ ...currentDoc, registrationNumber: e.target.value })}
              placeholder="e.g., 80G/2024/ABC123"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Validity *</label>
            <Input
              value={currentDoc.validity || ''}
              onChange={(e) => setCurrentDoc({ ...currentDoc, validity: e.target.value })}
              placeholder="e.g., Perpetual, 5 years"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Issue Date</label>
            <Input
              type="date"
              value={
                currentDoc.issueDate
                  ? new Date(currentDoc.issueDate).toISOString().split('T')[0]
                  : ''
              }
              onChange={(e) => setCurrentDoc({ ...currentDoc, issueDate: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Expiry Date</label>
            <Input
              type="date"
              value={
                currentDoc.expiryDate
                  ? new Date(currentDoc.expiryDate).toISOString().split('T')[0]
                  : ''
              }
              onChange={(e) => setCurrentDoc({ ...currentDoc, expiryDate: e.target.value })}
            />
          </div>

          <div className="col-span-2">
            <label className="block text-sm font-medium mb-2">Document URL</label>
            <Input
              value={currentDoc.fileUrl || ''}
              onChange={(e) => setCurrentDoc({ ...currentDoc, fileUrl: e.target.value })}
              placeholder="/documents/80g-certificate.pdf"
            />
          </div>

          <div className="col-span-2">
            <label className="block text-sm font-medium mb-2">Notes</label>
            <textarea
              rows={3}
              value={currentDoc.notes || ''}
              onChange={(e) => setCurrentDoc({ ...currentDoc, notes: e.target.value })}
              placeholder="Additional notes about this document..."
              className="w-full px-3 py-2 border rounded-md bg-background resize-none focus:ring-2 focus:ring-primary focus:outline-none"
            />
          </div>
        </div>
      </AdminDialog>

      {/* View Dialog */}
      <AdminDialog
        open={!!viewingDoc}
        onOpenChange={(open) => !open && setViewingDoc(null)}
        title={viewingDoc?.name || ''}
        description="Document Details"
        actions={
          <Button variant="outline" onClick={() => setViewingDoc(null)}>
            Close
          </Button>
        }
      >
        {viewingDoc && (
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="text-sm font-medium text-muted-foreground">Document Type</label>
              <p className="mt-1 font-medium">{viewingDoc.documentType}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">
                Registration Number
              </label>
              <p className="mt-1 font-mono bg-muted px-2 py-1 rounded-md inline-block">
                {viewingDoc.registrationNumber}
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Validity</label>
              <p className="mt-1">{viewingDoc.validity}</p>
            </div>
            {viewingDoc.issueDate && (
              <div>
                <label className="text-sm font-medium text-muted-foreground">Issue Date</label>
                <p className="mt-1">{new Date(viewingDoc.issueDate).toLocaleDateString()}</p>
              </div>
            )}
            {viewingDoc.expiryDate && (
              <div>
                <label className="text-sm font-medium text-muted-foreground">Expiry Date</label>
                <p className="mt-1">{new Date(viewingDoc.expiryDate).toLocaleDateString()}</p>
              </div>
            )}
            {viewingDoc.fileUrl && (
              <div className="col-span-2">
                <label className="text-sm font-medium text-muted-foreground">Document File</label>
                <p className="mt-1">
                  <a
                    href={viewingDoc.fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline flex items-center gap-2"
                  >
                    <FileText className="h-4 w-4" />
                    View Document
                  </a>
                </p>
              </div>
            )}
            {viewingDoc.notes && (
              <div className="col-span-2">
                <label className="text-sm font-medium text-muted-foreground">Notes</label>
                <p className="mt-1 whitespace-pre-wrap bg-muted/30 p-3 rounded-md text-sm">
                  {viewingDoc.notes}
                </p>
              </div>
            )}
          </div>
        )}
      </AdminDialog>

      <DeleteDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        onConfirm={confirmDelete}
        title="Delete Document"
        description="Are you sure you want to delete this document? This action cannot be undone."
        isLoading={isDeleting}
      />
    </div>
  );
}

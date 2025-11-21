'use client';

import { PermissionGate } from '@/components/admin/PermissionGate';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
  const [isEditing, setIsEditing] = useState(false);
  const [currentDoc, setCurrentDoc] = useState<Partial<LegalDocument>>({});
  const [isSaving, setIsSaving] = useState(false);
  const [viewingDoc, setViewingDoc] = useState<LegalDocument | null>(null);

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
            issueDate: currentDoc.issueDate ?? undefined,
            expiryDate: currentDoc.expiryDate ?? undefined,
            fileUrl: currentDoc.fileUrl ?? undefined,
            notes: currentDoc.notes ?? undefined,
            order: currentDoc.order,
          })
        : createLegalDocument({
            name: currentDoc.name,
            documentType: currentDoc.documentType,
            registrationNumber: currentDoc.registrationNumber,
            validity: currentDoc.validity,
            issueDate: currentDoc.issueDate ?? undefined,
            expiryDate: currentDoc.expiryDate ?? undefined,
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
        setIsEditing(false);
        setCurrentDoc({});
      }
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this document?')) return;

    const result = await showPromiseToast(deleteLegalDocument(id), {
      loading: 'Deleting document...',
      success: 'Document deleted!',
      error: 'Failed to delete document',
    });

    if (result.success) {
      await fetchDocuments();
    }
  };

  if (isLoading) {
    return <LoadingCard />;
  }

  // View modal
  if (viewingDoc) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gradient-primary">{viewingDoc.name}</h1>
          <Button variant="outline" onClick={() => setViewingDoc(null)}>
            ← Back to List
          </Button>
        </div>
        <Card>
          <CardContent className="p-6 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground">Document Type</label>
                <p className="mt-1">{viewingDoc.documentType}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  Registration Number
                </label>
                <p className="mt-1 font-mono">{viewingDoc.registrationNumber}</p>
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
                      className="text-primary hover:underline"
                    >
                      View Document →
                    </a>
                  </p>
                </div>
              )}
              {viewingDoc.notes && (
                <div className="col-span-2">
                  <label className="text-sm font-medium text-muted-foreground">Notes</label>
                  <p className="mt-1 whitespace-pre-wrap">{viewingDoc.notes}</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gradient-primary">Legal & Compliance</h1>
          <p className="text-muted-foreground mt-1">
            Manage organizational registrations and certifications
          </p>
        </div>
        <PermissionGate resource={Resource.LEGAL_DOCUMENTS} action="create">
          <Button
            onClick={() => {
              setIsEditing(true);
              setCurrentDoc({ order: documents.length });
            }}
            className="btn-gradient-primary"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Document
          </Button>
        </PermissionGate>
      </div>

      {isEditing && (
        <Card className="border-2 border-primary/20 shadow-lg animate-fade-in">
          <CardHeader>
            <CardTitle>{currentDoc.id ? 'Edit Document' : 'Add New Document'}</CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-4">
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
                  onChange={(e) =>
                    setCurrentDoc({ ...currentDoc, registrationNumber: e.target.value })
                  }
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
                  className="w-full px-3 py-2 border rounded-md bg-background resize-none"
                />
              </div>
            </div>

            <div className="flex gap-2 pt-4 border-t">
              <Button
                onClick={handleSave}
                disabled={
                  isSaving ||
                  !currentDoc.name ||
                  !currentDoc.documentType ||
                  !currentDoc.registrationNumber ||
                  !currentDoc.validity ||
                  !permissions.canUpdate
                }
                className="btn-gradient-primary"
              >
                {isSaving ? 'Saving...' : 'Save Document'}
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setIsEditing(false);
                  setCurrentDoc({});
                }}
                disabled={isSaving}
              >
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-4">
        {documents.length === 0 ? (
          <EmptyState
            icon={FileText}
            title="No legal documents yet"
            description="Add your first compliance document or certification"
            action={
              permissions.canCreate ? (
                <Button onClick={() => setIsEditing(true)} className="btn-gradient-primary">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Document
                </Button>
              ) : undefined
            }
          />
        ) : (
          documents.map((doc) => (
            <Card key={doc.id} className="card-hover">
              <CardContent className="p-6">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <FileText className="h-5 w-5 text-primary" />
                      <h3 className="font-semibold text-lg">{doc.name}</h3>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <p className="text-muted-foreground">
                        <span className="font-medium">Type:</span> {doc.documentType}
                      </p>
                      <p className="text-muted-foreground">
                        <span className="font-medium">Registration:</span>{' '}
                        <span className="font-mono">{doc.registrationNumber}</span>
                      </p>
                      <p className="text-muted-foreground">
                        <span className="font-medium">Validity:</span> {doc.validity}
                      </p>
                      {doc.expiryDate && (
                        <p className="text-muted-foreground">
                          <span className="font-medium">Expires:</span>{' '}
                          {new Date(doc.expiryDate).toLocaleDateString()}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" onClick={() => setViewingDoc(doc)}>
                      <Eye className="h-4 w-4 mr-1" />
                      View
                    </Button>
                    <PermissionGate resource={Resource.LEGAL_DOCUMENTS} action="update">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setCurrentDoc(doc);
                          setIsEditing(true);
                        }}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                    </PermissionGate>
                    <PermissionGate resource={Resource.LEGAL_DOCUMENTS} action="delete">
                      <Button size="sm" variant="destructive" onClick={() => handleDelete(doc.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </PermissionGate>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}

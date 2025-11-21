'use client';

import { PermissionGate } from '@/components/admin/PermissionGate';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { LoadingCard } from '@/components/ui/loading';
import { Textarea } from '@/components/ui/textarea';
import { getAboutContent, updateAboutContent } from '@/lib/actions';
import { usePermissions } from '@/lib/hooks/usePermissions';
import { Resource } from '@/lib/permissions';
import { showError, showPromiseToast } from '@/lib/toast-utils';
import { FileText, Save } from 'lucide-react';
import { useEffect, useState } from 'react';

interface AboutSection {
  id: string;
  section: string;
  title: string;
  content: string;
  imageUrl?: string | null;
  createdAt: Date | string;
  updatedAt: Date | string;
}

export default function AboutContentPage() {
  const [sections, setSections] = useState<AboutSection[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const permissions = usePermissions(Resource.ABOUT_CONTENT);

  useEffect(() => {
    fetchSections();
  }, []);

  const fetchSections = async () => {
    setIsLoading(true);
    const result = await getAboutContent();
    if (result.success && result.data) {
      setSections(result.data);
    } else {
      showError('Failed to load about content');
    }
    setIsLoading(false);
  };

  const handleSave = async (section: AboutSection) => {
    const result = await showPromiseToast(
      updateAboutContent(section.id, {
        title: section.title,
        content: section.content,
        imageUrl: section.imageUrl ?? undefined,
      }),
      {
        loading: 'Updating content...',
        success: 'Content updated successfully!',
        error: 'Failed to update content',
      }
    );

    if (result.success) {
      await fetchSections();
    }
  };

  if (isLoading) {
    return <LoadingCard />;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gradient-primary">About Content</h1>
        <p className="text-muted-foreground mt-1">Manage your organization's about page content</p>
      </div>

      <div className="space-y-6">
        {sections.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">
                No content found. Content will be created when you first save the seeded data.
              </p>
            </CardContent>
          </Card>
        ) : (
          sections.map((section) => (
            <AboutSectionEdit
              key={section.id}
              section={section}
              onSave={handleSave}
              canEdit={permissions.canUpdate}
            />
          ))
        )}
      </div>
    </div>
  );
}

function AboutSectionEdit({
  section,
  onSave,
  canEdit,
}: {
  section: AboutSection;
  onSave: (section: AboutSection) => void;
  canEdit: boolean;
}) {
  const [editedSection, setEditedSection] = useState(section);
  const [isEditing, setIsEditing] = useState(false);

  const handleSave = () => {
    onSave(editedSection);
    setIsEditing(false);
  };

  return (
    <Card className="card-hover">
      <CardHeader>
        <CardTitle>{section.title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {isEditing ? (
          <>
            <div>
              <label className="block text-sm font-medium mb-2">Title</label>
              <Input
                value={editedSection.title}
                onChange={(e) => setEditedSection({ ...editedSection, title: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Content</label>
              <Textarea
                rows={8}
                value={editedSection.content}
                onChange={(e) => setEditedSection({ ...editedSection, content: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Image URL (Optional)</label>
              <Input
                value={editedSection.imageUrl || ''}
                onChange={(e) => setEditedSection({ ...editedSection, imageUrl: e.target.value })}
                placeholder="/images/about/section.jpg"
              />
            </div>
            <div className="flex gap-2">
              <Button onClick={handleSave} className="btn-gradient-primary">
                <Save className="h-4 w-4 mr-2" />
                Save
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setEditedSection(section);
                  setIsEditing(false);
                }}
              >
                Cancel
              </Button>
            </div>
          </>
        ) : (
          <>
            <p className="text-muted-foreground whitespace-pre-wrap">{section.content}</p>
            {section.imageUrl && (
              <p className="text-sm text-muted-foreground">Image: {section.imageUrl}</p>
            )}
            <PermissionGate resource={Resource.ABOUT_CONTENT} action="update">
              <Button onClick={() => setIsEditing(true)} variant="outline">
                <Save className="h-4 w-4 mr-2" />
                Edit
              </Button>
            </PermissionGate>
          </>
        )}
      </CardContent>
    </Card>
  );
}

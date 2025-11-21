"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Plus,
  Edit,
  Trash2,
  Target,
  CheckCircle,
  XCircle,
  Crosshair,
} from "lucide-react";
import { PermissionGate } from "@/components/admin/PermissionGate";
import { EmptyState } from "@/components/ui/empty-state";
import { LoadingCard } from "@/components/ui/loading";
import { Resource } from "@/lib/permissions";
import { usePermissions } from "@/lib/hooks/usePermissions";
import {
  getObjectives,
  createObjective,
  updateObjective,
  deleteObjective,
} from "@/lib/actions";
import { showError, showPromiseToast } from "@/lib/toast-utils";

interface Objective {
  id: string;
  title: string;
  description: string;
  order: number;
  isActive: boolean;
  createdAt: Date | string;
  updatedAt: Date | string;
}

export default function ObjectivesPage() {
  const [objectives, setObjectives] = useState<Objective[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [currentObjective, setCurrentObjective] = useState<Partial<Objective>>(
    {}
  );
  const [isSaving, setIsSaving] = useState(false);

  const permissions = usePermissions(Resource.OBJECTIVES);

  useEffect(() => {
    fetchObjectives();
  }, []);

  const fetchObjectives = async () => {
    setIsLoading(true);
    const result = await getObjectives();
    if (result.success && result.data) {
      setObjectives(result.data);
    } else {
      showError("Failed to load objectives");
    }
    setIsLoading(false);
  };

  const handleSave = async () => {
    if (!currentObjective.title || !currentObjective.description) {
      showError("Please fill in required fields");
      return;
    }

    setIsSaving(true);
    try {
      const promise = currentObjective.id
        ? updateObjective(currentObjective.id, {
            title: currentObjective.title,
            description: currentObjective.description,
            order: currentObjective.order,
            isActive: currentObjective.isActive,
          })
        : createObjective({
            title: currentObjective.title,
            description: currentObjective.description,
            order: currentObjective.order ?? objectives.length,
            isActive: currentObjective.isActive ?? true,
          });

      const result = await showPromiseToast(promise, {
        loading: currentObjective.id
          ? "Updating objective..."
          : "Creating objective...",
        success: currentObjective.id
          ? "Objective updated!"
          : "Objective created!",
        error: "Failed to save objective",
      });

      if (result.success) {
        await fetchObjectives();
        setIsEditing(false);
        setCurrentObjective({});
      }
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this objective?")) return;

    const result = await showPromiseToast(deleteObjective(id), {
      loading: "Deleting objective...",
      success: "Objective deleted!",
      error: "Failed to delete objective",
    });

    if (result.success) {
      await fetchObjectives();
    }
  };

  if (isLoading) {
    return <LoadingCard />;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gradient-primary">
            Strategic Objectives
          </h1>
          <p className="text-muted-foreground mt-1">
            Define your organization's mission and goals
          </p>
        </div>
        <PermissionGate resource={Resource.OBJECTIVES} action="create">
          <Button
            onClick={() => {
              setIsEditing(true);
              setCurrentObjective({ order: objectives.length, isActive: true });
            }}
            className="btn-gradient-primary"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Objective
          </Button>
        </PermissionGate>
      </div>

      {isEditing && (
        <Card className="border-2 border-primary/20 shadow-lg animate-fade-in">
          <CardHeader>
            <CardTitle>
              {currentObjective.id ? "Edit Objective" : "Add New Objective"}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Title *</label>
              <Input
                value={currentObjective.title || ""}
                onChange={(e) =>
                  setCurrentObjective({
                    ...currentObjective,
                    title: e.target.value,
                  })
                }
                placeholder="e.g., Empower 1000 women by 2025"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Description *
              </label>
              <Textarea
                rows={3}
                value={currentObjective.description || ""}
                onChange={(e) =>
                  setCurrentObjective({
                    ...currentObjective,
                    description: e.target.value,
                  })
                }
                placeholder="Explain how this objective contributes to your mission..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Display Order
              </label>
              <Input
                type="number"
                value={currentObjective.order || 0}
                onChange={(e) =>
                  setCurrentObjective({
                    ...currentObjective,
                    order: parseInt(e.target.value),
                  })
                }
              />
            </div>

            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={currentObjective.isActive ?? true}
                onChange={(e) =>
                  setCurrentObjective({
                    ...currentObjective,
                    isActive: e.target.checked,
                  })
                }
                className="w-4 h-4 text-primary rounded focus:ring-primary"
              />
              <label className="text-sm font-medium">Active</label>
            </div>

            <div className="flex gap-2 pt-4 border-t">
              <Button
                onClick={handleSave}
                disabled={
                  isSaving || !currentObjective.title || !permissions.canUpdate
                }
                className="btn-gradient-primary"
              >
                {isSaving ? "Saving..." : "Save Objective"}
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setIsEditing(false);
                  setCurrentObjective({});
                }}
                disabled={isSaving}
              >
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {objectives.length === 0 ? (
          <div className="col-span-2">
            <EmptyState
              icon={Crosshair}
              title="No objectives yet"
              description="Define your strategic goals"
              action={
                permissions.canCreate ? (
                  <Button
                    onClick={() => setIsEditing(true)}
                    className="btn-gradient-primary"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Objective
                  </Button>
                ) : undefined
              }
            />
          </div>
        ) : (
          objectives.map((objective) => (
            <Card key={objective.id} className="card-hover group">
              <CardContent className="p-6">
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div className="flex items-start gap-3 flex-1">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <Target className="h-5 w-5 text-primary" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold">{objective.title}</h3>
                        {objective.isActive ? (
                          <CheckCircle className="h-4 w-4 text-green-600" />
                        ) : (
                          <XCircle className="h-4 w-4 text-red-600" />
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <PermissionGate
                      resource={Resource.OBJECTIVES}
                      action="update"
                    >
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setCurrentObjective(objective);
                          setIsEditing(true);
                        }}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                    </PermissionGate>
                    <PermissionGate
                      resource={Resource.OBJECTIVES}
                      action="delete"
                    >
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleDelete(objective.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </PermissionGate>
                  </div>
                </div>

                <p className="text-sm text-muted-foreground">
                  {objective.description}
                </p>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}

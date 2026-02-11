"use client";

import { useState } from "react";
import { useToast } from "@/app/components/ui/use-toast";
import { Button } from "@/app/components/ui/button";

export default function FeedbackDemo() {
  const { toast } = useToast();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const fakeApiCall = () =>
    new Promise((resolve) => setTimeout(resolve, 2000));

  const handleDeleteClick = () => {
    toast({
      title: "Action started",
      description: "Delete request initiated",
    });
    setIsModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    setIsModalOpen(false);
    setIsLoading(true);

    toast({
      title: "Deleting...",
      description: "Please wait",
    });

    try {
      await fakeApiCall();
      toast({
        title: "Success",
        description: "Item deleted successfully",
      });
    } catch {
      toast({
        title: "Error",
        description: "Failed to delete item",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-8 max-w-md mx-auto space-y-6">
      <h1 className="text-2xl font-bold">Feedback UI Demo</h1>

      <Button variant="destructive" onClick={handleDeleteClick}>
        Delete Item
      </Button>

      {/* Loader */}
      {isLoading && (
        <div
          role="status"
          aria-live="polite"
          className="text-sm text-muted-foreground"
        >
          Processing... Please wait.
        </div>
      )}

      {/* Modal */}
      {isModalOpen && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center"
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-title"
        >
          <div className="bg-background p-6 rounded-lg space-y-4 w-80">
            <h2 id="modal-title" className="text-lg font-semibold">
              Confirm Deletion
            </h2>
            <p>This action cannot be undone.</p>

            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => setIsModalOpen(false)}
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={handleConfirmDelete}
              >
                Confirm
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

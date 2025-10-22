
import React, { useRef, useState } from "react";
import { useNotes } from "@/hooks/useNotes";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuthLocal } from "@/hooks/useAuthLocal";

const Notes: React.FC = () => {
  const { user } = useAuthLocal();
  const { notes, isLoading, error, addNote, updateNote, deleteNote } = useNotes();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [newNote, setNewNote] = useState("");
  const [editContent, setEditContent] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  if (!user) {
    return (
      <Card className="mx-auto max-w-lg mt-10">
        <CardHeader>
          <CardTitle>Sign in required</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-center">Please sign in to view and manage your notes.</p>
        </CardContent>
      </Card>
    );
  }
  return (
    <div className="max-w-xl mx-auto mt-10 px-4">
      <h2 className="text-2xl font-bold mb-6">Your Notes</h2>
      <form
        onSubmit={async (e) => {
          e.preventDefault();
          if (!newNote.trim()) return;
          await addNote.mutateAsync(newNote);
          setNewNote("");
        }}
        className="flex gap-2 mb-6"
      >
        <Input
          ref={inputRef}
          value={newNote}
          onChange={(e) => setNewNote(e.target.value)}
          placeholder="Write a new note..."
        />
        <Button type="submit" disabled={addNote.isPending}>Add</Button>
      </form>

      {isLoading && <div>Loading notes…</div>}
      {error && <div className="text-red-600">Error: {error.message}</div>}
      {!isLoading && notes && notes.length === 0 && (
        <div className="text-muted-foreground text-center">No notes yet. Add your first note!</div>
      )}

      <div className="space-y-4">
        {notes &&
          notes.map((note) =>
            editingId === note.id ? (
              <Card key={note.id} className="relative">
                <CardContent className="flex flex-col gap-2">
                  <Input
                    value={editContent}
                    onChange={(e) => setEditContent(e.target.value)}
                    autoFocus
                  />
                  <div className="flex gap-2 mt-1">
                    <Button
                      size="sm"
                      onClick={async () => {
                        await updateNote.mutateAsync({ id: note.id, content: editContent });
                        setEditingId(null);
                      }}
                      disabled={updateNote.isPending}
                    >
                      Save
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => setEditingId(null)}
                    >
                      Cancel
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card key={note.id} className="relative group">
                <CardContent className="flex gap-2 items-center justify-between">
                  <span className="truncate max-w-xs">{note.content}</span>
                  <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setEditingId(note.id);
                        setEditContent(note.content);
                      }}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => deleteNote.mutate(note.id)}
                      disabled={deleteNote.isPending}
                    >
                      Delete
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )
          )}
      </div>
    </div>
  );
};

export default Notes;

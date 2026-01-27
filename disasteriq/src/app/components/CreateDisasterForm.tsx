"use client";

import { useState, useRef } from "react";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { useToast } from "@/app/hooks/use-toast";

type MediaItem = {
  url: string;
  type: "IMAGE" | "VIDEO";
  isUploading?: boolean;
};

export default function CreateDisasterForm() {
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState({
    name: "",
    type: "",
    severity: 1,
    location: "",
    status: "REPORTED",
  });

  const [media, setMedia] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(false);

  // -------------------------
  // FORM CHANGE
  // -------------------------
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: name === "severity" ? Number(value) : value,
    }));
  };

  // -------------------------
  // FILE SELECT
  // -------------------------
  const handleFileSelect = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files = e.target.files;
    if (!files) return;

    for (const file of Array.from(files)) {
      if (
        !file.type.startsWith("image/") &&
        !file.type.startsWith("video/")
      ) {
        toast({
          title: "Invalid file",
          description: file.name,
          variant: "destructive",
        });
        continue;
      }

      const index = media.length;

      setMedia((prev) => [
        ...prev,
        {
          url: "",
          type: file.type.startsWith("image")
            ? "IMAGE"
            : "VIDEO",
          isUploading: true,
        },
      ]);

      await uploadToS3(file, index);
    }

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // -------------------------
  // S3 UPLOAD (SIGNED URL)
  // -------------------------
 const uploadToS3 = async (file: File, index: number) => {
  try {
    const res = await fetch("/Api/upload", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ filename: file.name }),
    });

    if (!res.ok) {
      throw new Error("Failed to get presigned POST");
    }

    const data = await res.json();

    // 🔐 HARD VALIDATION
    if (!data?.url || !data?.fields) {
      console.error("Invalid presigned POST response", data);
      throw new Error("Invalid upload configuration");
    }

    const { url, fields } = data;

    const s3FormData = new FormData();
    Object.entries(fields).forEach(([k, v]) => {
      s3FormData.append(k, v as string);
    });
    s3FormData.append("file", file);

    const uploadRes = await fetch(url, {
      method: "POST",
      body: s3FormData,
    });

    if (!uploadRes.ok) {
      throw new Error("S3 upload failed");
    }

    const fileUrl = `${url}/${fields.key}`;

    setMedia((prev) =>
      prev.map((m, i) =>
        i === index ? { ...m, url: fileUrl, isUploading: false } : m
      )
    );

    toast({
      title: "Uploaded",
      description: file.name,
    });
  } catch (err: any) {
    console.error("UPLOAD ERROR:", err);

    setMedia((prev) => prev.filter((_, i) => i !== index));

    toast({
      title: "Upload failed",
      description: err.message ?? "Unknown error",
      variant: "destructive",
    });
  }
};


  // -------------------------
  // SUBMIT DISASTER (FORM-DATA)
  // -------------------------
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const validMedia = media.filter(
      (m) => m.url && !m.isUploading
    );

    if (!form.name || !form.type || !form.location) {
      toast({
        title: "Missing fields",
        variant: "destructive",
      });
      return;
    }

    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("name", form.name);
      formData.append("type", form.type);
      formData.append("severity", String(form.severity));
      formData.append("location", form.location);
      formData.append("status", form.status);

      formData.append(
        "media",
        JSON.stringify(
          validMedia.map((m) => ({
            url: m.url,
            type: m.type,
          }))
        )
      );

      const res = await fetch(
        "/Api/disasters/create",
        {
          method: "POST",
          body: formData,
          credentials: "include",
        }
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Create failed");
      }

      toast({
        title: "Success",
        description: "Disaster created successfully",
      });

      setForm({
        name: "",
        type: "",
        severity: 1,
        location: "",
        status: "REPORTED",
      });
      setMedia([]);
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // -------------------------
  // UI
  // -------------------------
  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-2xl space-y-6 rounded-lg border p-6 bg-white"
    >
      <h2 className="text-2xl font-bold">Create Disaster</h2>

      <Input name="name" placeholder="Name" value={form.name} onChange={handleChange} />
      <Input name="type" placeholder="Type" value={form.type} onChange={handleChange} />
      <Input name="location" placeholder="Location" value={form.location} onChange={handleChange} />

      <input
        type="number"
        name="severity"
        min={1}
        max={10}
        value={form.severity}
        onChange={handleChange}
        className="w-full border px-3 py-2 rounded"
      />

      <select
        name="status"
        value={form.status}
        onChange={handleChange}
        className="w-full border px-3 py-2 rounded"
      >
        <option value="REPORTED">REPORTED</option>
        <option value="ONGOING">ONGOING</option>
        <option value="RESOLVED">RESOLVED</option>
      </select>

      <div className="space-y-2">
        <Button
          type="button"
          variant="outline"
          onClick={() => fileInputRef.current?.click()}
        >
          Upload Media
        </Button>

        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*,video/*"
          onChange={handleFileSelect}
          className="hidden"
        />

        {media.map((m, i) => (
          <p key={i} className="text-sm">
            {m.isUploading ? "Uploading..." : m.url}
          </p>
        ))}
      </div>

      <Button type="submit" disabled={loading}>
        {loading ? "Creating..." : "Create Disaster"}
      </Button>
    </form>
  );
}

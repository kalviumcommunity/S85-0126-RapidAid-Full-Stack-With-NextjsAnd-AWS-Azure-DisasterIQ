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

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: name === "severity" ? Number(value) : value,
    }));
  };

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

  const uploadToS3 = async (file: File, index: number) => {
    try {
      const res = await fetch("/Api/upload", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ filename: file.name }),
      });

      const data = await res.json();
      const { url, fields } = data;

      const s3FormData = new FormData();
      Object.entries(fields).forEach(([k, v]) => {
        s3FormData.append(k, v as string);
      });
      s3FormData.append("file", file);

      await fetch(url, { method: "POST", body: s3FormData });

      const fileUrl = `${url}/${fields.key}`;

      setMedia((prev) =>
        prev.map((m, i) =>
          i === index ? { ...m, url: fileUrl, isUploading: false } : m
        )
      );

      toast({ title: "Uploaded", description: file.name });
    } catch (err: any) {
      setMedia((prev) => prev.filter((_, i) => i !== index));
      toast({
        title: "Upload failed",
        description: err.message,
        variant: "destructive",
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setLoading(false);
  };

  /* ================= UI ================= */
  return (
    <form
      onSubmit={handleSubmit}
      className="
        space-y-6
        rounded-2xl
        border border-slate-200
        bg-white
        p-8
        shadow-sm
      "
    >
      {/* Header */}
      <div className="space-y-1">
        <h2 className="text-xl font-semibold text-slate-800">
          Create Disaster
        </h2>
        <p className="text-sm text-slate-500">
          Fill in the details to report a disaster
        </p>
      </div>

      {/* Disaster Name */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-slate-700">
          Disaster Name
        </label>
        <Input
          name="name"
          placeholder="e.g. Chennai Floods"
          value={form.name}
          onChange={handleChange}
          className="bg-white border-slate-300 text-slate-900 placeholder:text-slate-400"
        />
      </div>

      {/* Disaster Type */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-slate-700">
          Disaster Type
        </label>
        <Input
          name="type"
          placeholder="Flood, Earthquake, Fire"
          value={form.type}
          onChange={handleChange}
          className="bg-white border-slate-300 text-slate-900 placeholder:text-slate-400"
        />
      </div>

      {/* Location */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-slate-700">
          Location
        </label>
        <Input
          name="location"
          placeholder="City, State"
          value={form.location}
          onChange={handleChange}
          className="bg-white border-slate-300 text-slate-900 placeholder:text-slate-400"
        />
      </div>

      {/* Severity */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-slate-700">
          Severity (1–10)
        </label>
        <input
          type="number"
          name="severity"
          min={1}
          max={10}
          value={form.severity}
          onChange={handleChange}
          className="
            w-full rounded-md border border-slate-300
            px-3 py-2 text-sm text-slate-900
            focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20
          "
        />
      </div>

      {/* Status */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-slate-700">
          Status
        </label>
        <select
          name="status"
          value={form.status}
          onChange={handleChange}
          className="
            w-full rounded-md border border-slate-300
            px-3 py-2 text-sm bg-white text-slate-900
            focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20
          "
        >
          <option value="REPORTED">REPORTED</option>
          <option value="ONGOING">ONGOING</option>
          <option value="RESOLVED">RESOLVED</option>
        </select>
      </div>

      {/* Media Upload */}
<div className="space-y-3">
  <label className="text-sm font-medium text-slate-700">
    Media Upload
  </label>

  {/* Visible upload box */}
  <div
    onClick={() => fileInputRef.current?.click()}
    className="
      flex cursor-pointer items-center justify-center
      rounded-lg border border-dashed border-slate-300
      bg-slate-50 px-4 py-6 text-sm text-slate-500
      hover:bg-slate-100 transition
    "
  >
    Click to upload images or videos
  </div>

  {/* Hidden file input */}
  <input
    ref={fileInputRef}
    type="file"
    multiple
    accept="image/*,video/*"
    onChange={handleFileSelect}
    className="hidden"
  />

  {/* Uploaded media status */}
  {media.length > 0 && (
    <div className="space-y-1 text-sm text-slate-600">
      {media.map((m, i) => (
        <p key={i}>
          {m.isUploading ? "Uploading…" : "Uploaded"}
        </p>
      ))}
    </div>
  )}
</div>

      {/* Submit */}
     <div className="pt-4">
  <Button
    type="submit"
    disabled={loading}
    className="
      w-full
      bg-blue-600
      text-white
      hover:bg-blue-700
      active:bg-blue-800
      disabled:opacity-60
      disabled:cursor-not-allowed
    "
  >
    {loading ? "Creating…" : "Create Disaster"}
  </Button>
</div>

    </form>
  );
}

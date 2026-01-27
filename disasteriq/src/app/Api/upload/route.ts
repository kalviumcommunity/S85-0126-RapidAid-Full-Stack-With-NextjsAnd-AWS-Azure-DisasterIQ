import { NextResponse } from "next/server";
import { S3Client } from "@aws-sdk/client-s3";
import { createPresignedPost } from "@aws-sdk/s3-presigned-post";

const s3 = new S3Client({
  region: process.env.AWS_REGION!, // eu-north-1
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

export async function POST(req: Request) {
  try {
    const { filename } = await req.json();

    if (!filename) {
      return NextResponse.json(
        { message: "Filename required" },
        { status: 400 }
      );
    }

    const key = `uploads/${Date.now()}-${filename}`;

    const presignedPost = await createPresignedPost(s3, {
      Bucket: process.env.AWS_BUCKET_NAME!,
      Key: key,
      Expires: 60,
      Conditions: [
        ["content-length-range", 0, 50_000_000], // 50MB
      ],
    });

    return NextResponse.json({
      url: presignedPost.url,
      fields: presignedPost.fields,
      key,
    });
  } catch (err) {
    console.error("Presigned POST error:", err);
    return NextResponse.json(
      { message: "Failed to generate presigned POST" },
      { status: 500 }
    );
  }
}

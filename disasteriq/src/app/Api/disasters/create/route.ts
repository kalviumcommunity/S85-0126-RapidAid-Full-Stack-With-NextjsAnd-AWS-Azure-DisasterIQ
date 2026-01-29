import { DisasterService } from "@/app/Service/disaster_service";
import { sendSuccess, sendError } from "@/app/lib/ responseHandler";
import { ERROR_CODES } from "@/app/lib/ errorCodes";
import { apiHandler } from "@/app/lib/ apiWrapper";
import { createDisasterSchema } from "@/app/lib/schema";
import { ZodError } from "zod";
import { EmailService } from "@/app/Service/email.service";
import { prisma } from "@/app/prisma/prisma";


export const POST = apiHandler(async (req: Request & { user?: any }) => {
  try {
    // 🔐 HARD AUTH GUARD (REQUIRED)
    if (!req.user) {
      return sendError(
        "Unauthorized: authentication required",
        ERROR_CODES.UNAUTHORIZED,
        401
      );
    }

    /* 🔐 RBAC CHECK — GOVERNMENT ONLY */
    if (req.user.role !== "GOVERNMENT_ADMIN") {
      console.log(
        `[RBAC] ${req.user.role} attempted DISASTER_CREATE: DENIED`
      );

      return sendError(
        "Access denied: government authority required",
        ERROR_CODES.FORBIDDEN,
        403
      );
    }

    console.log(
      `[RBAC] ${req.user.role} attempted DISASTER_CREATE: ALLOWED`
    );

    const body = await req.json();

    // ✅ Validate request body
    const validatedBody = createDisasterSchema.parse(body);

    // ✅ Create disaster WITH government ownership
    const disaster = await DisasterService.create({
      ...validatedBody,
      governmentId: req.user.governmentId, // 🔥 REQUIRED
      createdByUserId: req.user.id, // audit log
    });

    // 📧 Send disaster alert emails to relevant users (non-blocking, fire-and-forget)
    // This runs asynchronously and won't block the disaster creation response.
    // Each user receives a personalized email with their own name.
    // All eligible users are notified (no limit), batched to respect SES rate limits.
    (async () => {
      try {
        // Fetch ALL eligible users (no limit - ensures every user gets notified)
        const users = await prisma.user.findMany({
          where: {
            OR: [
              { roles: { some: { role: { name: "GOVERNMENT_ADMIN" } } } },
              { roles: { some: { role: { name: "USER" } } }, isActive: true },
            ],
          },
          select: { email: true, name: true },
        });

        if (users.length === 0) {
          console.log("📧 No users found for disaster alert emails");
          return;
        }

        // Filter to only users with valid email and name
        const validUsers = users.filter((u) => u.email && u.name);
        if (validUsers.length === 0) {
          console.log("📧 No valid users with email and name found");
          return;
        }

        const dashboardUrl = process.env.NEXT_PUBLIC_APP_URL
          ? `${process.env.NEXT_PUBLIC_APP_URL}/disasters`
          : "https://rapidaid.app/disasters";

        // Send individual emails to each user with their personalized name
        // Batch emails in groups of 10 to avoid overwhelming SES rate limits
        const BATCH_SIZE = 10;
        let successCount = 0;
        let failureCount = 0;

        console.log(
          `📧 Starting disaster alert email process for ${validUsers.length} users`
        );

        for (let i = 0; i < validUsers.length; i += BATCH_SIZE) {
          const batch = validUsers.slice(i, i + BATCH_SIZE);
          
          // Send emails in parallel within each batch
          // Each user gets their own personalized email with their name
          const emailPromises = batch.map((user) =>
            EmailService.sendDisasterAlertEmail({
              to: user.email!,
              userName: user.name || "User", // ✅ Each user gets their own name, not users[0]?.name
              disasterName: validatedBody.name,
              disasterLocation: validatedBody.location,
              disasterType: validatedBody.type,
              dashboardUrl,
            })
              .then((result) => {
                if (result.success) {
                  successCount++;
                  return { success: true, email: user.email };
                } else {
                  failureCount++;
                  console.error(
                    `❌ Failed to send alert to ${user.email}:`,
                    result.error
                  );
                  return {
                    success: false,
                    email: user.email,
                    error: result.error,
                  };
                }
              })
              .catch((error) => {
                failureCount++;
                console.error(
                  `❌ Exception sending alert to ${user.email}:`,
                  error
                );
                return {
                  success: false,
                  email: user.email,
                  error: error.message || "Unknown error",
                };
              })
          );

          // Wait for all emails in this batch to complete (success or failure)
          await Promise.allSettled(emailPromises);
          
          // Small delay between batches to respect SES rate limits
          if (i + BATCH_SIZE < validUsers.length) {
            await new Promise((resolve) => setTimeout(resolve, 100));
          }
        }

        console.log(
          `📧 Disaster alert emails completed: ${successCount} successful, ${failureCount} failed out of ${validUsers.length} total users`
        );
      } catch (error) {
        // Log error but don't throw - disaster creation should succeed even if emails fail
        // This catch handles any errors in the user fetching or batch processing logic
        console.error(
          "❌ Failed to send disaster alert emails (non-critical):",
          error
        );
      }
    })().catch((error) => {
      // Extra safety: catch any unhandled promise rejections from the IIFE
      console.error(
        "❌ Unhandled error in disaster alert email process:",
        error
      );
    });

    return sendSuccess(disaster, "Disaster created", 201);

  } catch (err: any) {
    if (err instanceof ZodError) {
      return sendError(
        err.issues
          .map(e => `${e.path.join(".")}: ${e.message}`)
          .join("; "),
        ERROR_CODES.VALIDATION_ERROR,
        400
      );
    }

    return sendError(
      err.message ?? "Internal server error",
      err.code ?? ERROR_CODES.INTERNAL_ERROR,
      500
    );
  }
});

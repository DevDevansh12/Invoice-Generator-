// src/utils/emailService.ts

interface Attachment {
  filename: string;
  content: Blob;
}

interface EmailData {
  to: string;
  subject: string;
  body: string;
  attachments?: Attachment[];
}

/**
 * Sends an email with optional attachments
 * @param emailData The email data including recipient, subject, body and attachments
 * @returns Promise that resolves when email is sent
 */
export const sendEmail = async (emailData: EmailData): Promise<void> => {
  try {
    // Here you would integrate with your actual email service provider
    // This could be a direct API call or via your backend service

    // Example implementation using a backend API endpoint
    const formData = new FormData();
    formData.append("to", emailData.to);
    formData.append("subject", emailData.subject);
    formData.append("body", emailData.body);

    // Add attachments if any
    if (emailData.attachments && emailData.attachments.length > 0) {
      emailData.attachments.forEach((attachment, index) => {
        formData.append(
          `attachment${index}`,
          attachment.content,
          attachment.filename
        );
      });
    }

    // Replace with your actual API endpoint
    const response = await fetch("/api/send-email", {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`Failed to send email: ${response.statusText}`);
    }

    const result = await response.json();
    console.log("Email sent successfully:", result);

    return result;
  } catch (error) {
    console.error("Error sending email:", error);
    throw error;
  }
};

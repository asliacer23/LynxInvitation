import { supabase } from '@/lib/supabase';

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

interface EmailTemplate {
  type: 'invitation' | 'reminder' | 'rsvp-confirmation' | 'welcome';
  recipientName: string;
  eventName: string;
  eventDate?: string;
  eventTime?: string;
  eventLocation?: string;
  invitationLink?: string;
  additionalData?: Record<string, any>;
}

class EmailService {
  /**
   * Send invitation email
   */
  async sendInvitation(
    guestEmail: string,
    guestName: string,
    eventName: string,
    invitationLink: string,
    eventDate?: string,
    eventLocation?: string
  ): Promise<boolean> {
    try {
      const html = this.generateInvitationTemplate({
        type: 'invitation',
        recipientName: guestName,
        eventName,
        eventDate,
        eventLocation,
        invitationLink,
      });

      return await this.sendEmail({
        to: guestEmail,
        subject: `You're Invited to ${eventName}`,
        html,
      });
    } catch (error) {
      console.error('Error sending invitation email:', error);
      return false;
    }
  }

  /**
   * Send RSVP reminder email
   */
  async sendReminder(guestEmail: string, guestName: string, eventName: string, invitationLink: string): Promise<boolean> {
    try {
      const html = this.generateReminderTemplate({
        type: 'reminder',
        recipientName: guestName,
        eventName,
        invitationLink,
      });

      return await this.sendEmail({
        to: guestEmail,
        subject: `Reminder: Please RSVP for ${eventName}`,
        html,
      });
    } catch (error) {
      console.error('Error sending reminder email:', error);
      return false;
    }
  }

  /**
   * Send RSVP confirmation email
   */
  async sendRSVPConfirmation(guestEmail: string, guestName: string, eventName: string, attending: string): Promise<boolean> {
    try {
      const html = this.generateRSVPConfirmationTemplate({
        type: 'rsvp-confirmation',
        recipientName: guestName,
        eventName,
        additionalData: { attending },
      });

      return await this.sendEmail({
        to: guestEmail,
        subject: `RSVP Confirmation for ${eventName}`,
        html,
      });
    } catch (error) {
      console.error('Error sending RSVP confirmation email:', error);
      return false;
    }
  }

  /**
   * Generic email sending method
   * Note: This uses Supabase Email service. Configure in your Supabase project.
   */
  private async sendEmail(options: EmailOptions): Promise<boolean> {
    try {
      // Use Supabase Edge Function for sending emails
      const { error } = await supabase.functions.invoke('send-email', {
        body: {
          to: options.to,
          subject: options.subject,
          html: options.html,
          text: options.text,
        },
      });

      if (error) {
        console.error('Email sending error:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error sending email:', error);
      return false;
    }
  }

  /**
   * Generate invitation email HTML template
   */
  private generateInvitationTemplate(data: EmailTemplate): string {
    const { recipientName, eventName, eventDate, eventLocation, invitationLink } = data;

    return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8">
          <style>
            body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #d4af37 0%, #1a1a1a 100%); color: white; padding: 30px; border-radius: 8px 8px 0 0; text-align: center; }
            .header h1 { margin: 0; font-size: 2em; }
            .content { background: #f9f9f9; padding: 30px; }
            .details { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; }
            .detail-item { display: flex; justify-content: space-between; margin: 10px 0; padding: 10px 0; border-bottom: 1px solid #eee; }
            .detail-label { font-weight: 600; color: #d4af37; }
            .cta-button { display: inline-block; background: #d4af37; color: #1a1a1a; padding: 15px 40px; text-decoration: none; border-radius: 8px; font-weight: 600; margin-top: 20px; }
            .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>You're Invited! 🎉</h1>
            </div>
            <div class="content">
              <p>Dear <strong>${recipientName}</strong>,</p>
              <p>You are cordially invited to</p>
              <h2 style="color: #d4af37; text-align: center;">${eventName}</h2>
              
              <div class="details">
                ${
                  eventDate
                    ? `
                  <div class="detail-item">
                    <span class="detail-label">📅 Date:</span>
                    <span>${eventDate}</span>
                  </div>
                `
                    : ''
                }
                ${
                  eventLocation
                    ? `
                  <div class="detail-item">
                    <span class="detail-label">📍 Location:</span>
                    <span>${eventLocation}</span>
                  </div>
                `
                    : ''
                }
              </div>

              <p>We would be delighted to have you celebrate with us. Please confirm your attendance at your earliest convenience.</p>
              
              ${
                invitationLink
                  ? `
                <div style="text-align: center;">
                  <a href="${invitationLink}" class="cta-button">View & RSVP</a>
                </div>
              `
                  : ''
              }
              
              <p style="margin-top: 30px; font-size: 12px; color: #666;">
                If you have any questions, please don't hesitate to contact us.
              </p>
            </div>
            <div class="footer">
              <p>© LynxInvitation - Your Digital Invitation Platform</p>
            </div>
          </div>
        </body>
      </html>
    `;
  }

  /**
   * Generate reminder email HTML template
   */
  private generateReminderTemplate(data: EmailTemplate): string {
    const { recipientName, eventName, invitationLink } = data;

    return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8">
          <style>
            body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #ff9800; color: white; padding: 20px; border-radius: 8px 8px 0 0; text-align: center; }
            .content { background: #f9f9f9; padding: 30px; }
            .cta-button { display: inline-block; background: #d4af37; color: #1a1a1a; padding: 15px 40px; text-decoration: none; border-radius: 8px; font-weight: 600; margin-top: 20px; }
            .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Friendly Reminder 👋</h1>
            </div>
            <div class="content">
              <p>Hi ${recipientName},</p>
              <p>We hope you haven't forgotten about <strong>${eventName}</strong>!</p>
              <p>If you haven't already, please let us know if you'll be attending by clicking the button below.</p>
              
              ${
                invitationLink
                  ? `
                <div style="text-align: center;">
                  <a href="${invitationLink}" class="cta-button">Confirm Your RSVP</a>
                </div>
              `
                  : ''
              }
              
              <p>We look forward to celebrating with you!</p>
            </div>
            <div class="footer">
              <p>© LynxInvitation - Your Digital Invitation Platform</p>
            </div>
          </div>
        </body>
      </html>
    `;
  }

  /**
   * Generate RSVP confirmation email HTML template
   */
  private generateRSVPConfirmationTemplate(data: EmailTemplate): string {
    const { recipientName, eventName, additionalData } = data;
    const attending = additionalData?.attending || 'unknown';

    return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8">
          <style>
            body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #4caf50 0%, #2e7d32 100%); color: white; padding: 20px; border-radius: 8px 8px 0 0; text-align: center; }
            .content { background: #f9f9f9; padding: 30px; }
            .confirmation { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #4caf50; }
            .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>RSVP Confirmed ✓</h1>
            </div>
            <div class="content">
              <p>Dear ${recipientName},</p>
              <p>Thank you for confirming your attendance!</p>
              
              <div class="confirmation">
                <p><strong>Event:</strong> ${eventName}</p>
                <p><strong>Your Response:</strong> <span style="color: #4caf50; font-weight: 600;">${attending === 'yes' ? 'I will attend ✓' : attending === 'no' ? 'I cannot attend' : 'Maybe'}</span></p>
              </div>

              <p>We're excited to have you celebrate with us!</p>
            </div>
            <div class="footer">
              <p>© LynxInvitation - Your Digital Invitation Platform</p>
            </div>
          </div>
        </body>
      </html>
    `;
  }
}

export const emailService = new EmailService();

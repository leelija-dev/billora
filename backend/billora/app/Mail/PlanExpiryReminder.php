<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class PlanExpiryReminder extends Mailable
{
    use Queueable, SerializesModels;

    public $user;
    public $plan;
    public $daysLeft;
    public $expireDate;
    /**
     * Create a new message instance.
     */
    public function __construct($user,$plan,$daysLeft,$expireDate)
    {
        $this->user = $user;
        $this->plan = $plan;
        $this->daysLeft = $daysLeft;
        $this->expireDate = $expireDate;
    }

    /**
     * Get the message envelope.
     */
    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'Plan Expiry Reminder',
        );
    }

    /**
     * Get the message content definition.
     */
    public function content(): Content
    {
        return new Content(
            view: 'emails.plan-expiry',
        );
    }

    /**
     * Get the attachments for the message.
     *
     * @return array<int, \Illuminate\Mail\Mailables\Attachment>
     */
    public function attachments(): array
    {
        return [];
    }
}

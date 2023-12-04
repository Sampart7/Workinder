export interface Message {
    id: number
    senderId: number
    senderEmail: string
    senderPhotoUrl: string
    recipientId: number
    recipientEmail: string
    recipientPhotoUrl: string
    content: string
    timeRead?: Date
    timeSent: Date
  }
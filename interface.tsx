export enum MessageType {
  BotMessage,
  UserMessage
}

export interface MessageItem {
  type: MessageType
  content: string
}

export interface Session
  {
    id: string,
    timestamp: number,
    messagesCount: number
  }


export const userRole = "Human";
export const botRole = "AI";

export interface Message {
  role: typeof userRole | typeof botRole;
  content: string;
}

export interface ChatId {
  chatid: string;
}

export interface StoreApiKeysProps {
  isModal: boolean;
  setIsModal: (isModal: boolean) => void;
  setOpenAiKey: (voice: string) => void;
  setElevenLabsKey: (voice: string) => void;
}

export interface ChatMessagesProps {
  chatHistory: Message[];
}

export interface ChatInputProps {
  input: string;
  setInput: (input: string) => void;
  loading: boolean;
  sendMessage: (e: React.FormEvent<HTMLFormElement>) => void;
}

export interface ChatControlsProps {
  audioRef: React.RefObject<HTMLAudioElement>;
  savedAudio: boolean;
  messages: Message[];
  clearMessages: () => void;
}

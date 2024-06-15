import { useRef, useEffect } from 'react'
import { Layout, Spin, Button } from 'antd'
import { MessageItem, MessageType } from '../../interface'
import TranslateIconBtn from './TranslateIconBtn'
import { AudioOutlined } from '@ant-design/icons'

import SpeechRecognition, {
  useSpeechRecognition
} from 'react-speech-recognition'

interface ConversationProps {
  messages: MessageItem[]
  getTranslation: (messageIdx: number) => Promise<void>
  responding: boolean
  chosenLang: string
  collapseMenu: boolean
  collapseSuggestion: boolean
}

const Conversation = ({
  messages,
  getTranslation,
  responding,
  chosenLang,
  collapseMenu,
  collapseSuggestion
}: ConversationProps) => {
  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const { Content } = Layout

  const messagesEndRef = useRef<null | HTMLDivElement>(null)

  const langMapper = {
    english: 'en-US',
    french: 'fr-FR',
    spanish: 'es-ES',
    japanese: 'ja',
    chinese: 'zh-CN',
  }

  const { listening } = useSpeechRecognition()

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <Layout id='content-layout'>
      <Content id='chat-view-content' className={`overlay ${!collapseMenu || !collapseSuggestion ? 'overlay-active' : ''}`}>
        {messages.map((message, idx) => (
          <div
            className={
              message.type === MessageType.BotMessage
                ? 'message-bot'
                : 'message-user'
            }
            key={'message' + idx}
          >
            <p>{message.content}</p>
            {message.type === MessageType.BotMessage && (
              <TranslateIconBtn
                messageIdx={idx}
                getTranslation={getTranslation}
              />
            )}
          </div>
        ))}
        <div ref={messagesEndRef} id="message-end"></div>
      </Content>
          <div
            id='audio-button-wrapper'
            onClick={() => {
              if (listening) {
                SpeechRecognition.stopListening()
              } else {
                SpeechRecognition.startListening({
                  language: langMapper[chosenLang as keyof typeof langMapper]
                })
              }
            }}
            // onPointerDown={() => {
            //   SpeechRecognition.startListening({
            //     language: langMapper[chosenLang as keyof typeof langMapper]
            //   })
            // }}
            // onMouseDown={() => {
            //   SpeechRecognition.startListening({
            //     language: langMapper[chosenLang as keyof typeof langMapper]
            //   })
            // }}
            // onPointerUp={() => {
            //   setTimeout(() => {

            //   }, 500)
            // }}
            // onMouseUp={() => {
            //   setTimeout(() => {
            //     SpeechRecognition.stopListening()
            //   }, 500)
            // }}
          >
            <div>
            {responding ? (
              <Spin size='large' />
            ) : (
              <Button
                type={listening ? 'primary' : 'default'}
                icon={<AudioOutlined />}
                shape='circle'
                style={{
                  height: '50px',
                  width: '50px'
                }}
              />
            )}
            </div>
          </div>
    </Layout>
  )
}

export default Conversation

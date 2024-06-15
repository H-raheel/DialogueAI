import './styles.module.css'
import { Layout } from 'antd'
import axios from 'axios'
import { useEffect, useState, useLayoutEffect } from 'react'
import { v4 as uuidv4 } from 'uuid'
import { addDoc, collection, setDoc, doc, updateDoc } from 'firebase/firestore'
import { useSpeechRecognition } from 'react-speech-recognition'
import { MessageItem, MessageType } from '../../interface'
import { FFieldValue, db } from '../api/firebase'

import SideMenu from './SideMenu'
import Conversation from './Conversation'
import ConvoHelper from './ConvoHelper'
import MobileHeader from './MobileHeader'

export const url = process.env.REACT_APP_CONVOBOT_URL
const TRACKING_ENABLED =
  process.env.REACT_APP_TRACKING_ENABLED_CONVOBOT === 'false' ? false : true

let sessionId = ''

const ChatView = () => {
  const [messages, setMessages] = useState<MessageItem[]>([])
  const [suggestions, setSuggestions] = useState<string[]>([])
  const [responding, setResponding] = useState(false)
  const [chosenScenario, setChosenScenario] = useState('cafe')
  const [chosenLang, setChosenLang] = useState('english')
  const [nativeLang, setNativeLang] = useState('english')
  const [collapseMenu, setCollapseMenu] = useState(false)
  const [collapseSuggestion, setCollapseSuggestion] = useState(false)
  const [windowWidth, setWindowWidth] = useState(window.innerWidth)

  const utterance = new SpeechSynthesisUtterance()

  useEffect(() => {
    sessionId = uuidv4()
    if (TRACKING_ENABLED) {
      setDoc(doc(db, 'sessions', sessionId), {
        messages_count: 0,
        timestamp: Math.round(new Date().getTime() / 1000)
      })
    }
    respond('')
    // alert('Press and hold the mic button to speak')
  }, [chosenLang, nativeLang, chosenScenario])

  useLayoutEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth)
    }

    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  useEffect(() => {
    if (windowWidth > 1001) {
      setCollapseMenu(false)
      setCollapseSuggestion(false)
    }
  }, [windowWidth])

  const { transcript, finalTranscript, resetTranscript, browserSupportsSpeechRecognition } =
    useSpeechRecognition()

  useEffect(() => {
    if (finalTranscript) {
      setMessages(prevMessages => [
        ...prevMessages,
        {
          type: MessageType.UserMessage,
          content: finalTranscript
        }
      ])
      respond(finalTranscript)
      if (TRACKING_ENABLED) {
        addDoc(collection(db, 'messages'), {
          type: 'user',
          session_id: sessionId,
          content: finalTranscript
        })

        updateDoc(doc(db, 'sessions', sessionId), {
          messages_count: FFieldValue.increment(1)
        })
      }
    }
  }, [finalTranscript])

  const { Header } = Layout

  if (!browserSupportsSpeechRecognition) {
    alert(
      "Browser doesn't support speech recognition. Please consider using the latest version of chrome on desktop."
    )
  }

  const parseBotResponse = (message: string) => {
    let parsedMessage: any = message.trim()

    while (typeof parsedMessage !== 'object') {
      try {
        parsedMessage = JSON.parse(parsedMessage)
      } catch (error) {
        console.log('ERROR PARSING', error, parsedMessage)
        parsedMessage = {
          content: parsedMessage,
          suggestion: ''
        }
      }
    }
    return parsedMessage
  }

  const respond = async (latest: string) => {
    setResponding(true)
    const botMessage = await getResponse(latest)
    if (TRACKING_ENABLED) {
      addDoc(collection(db, 'messages'), {
        type: 'bot',
        session_id: sessionId,
        content: botMessage
      })
      updateDoc(doc(db, 'sessions', sessionId), {
        messages_count: FFieldValue.increment(1)
      })
    }
    const { content, suggestion } = parseBotResponse(botMessage)
    setMessages(prevMessages => [
      ...prevMessages,
      {
        type: MessageType.BotMessage,
        content: content
      }
    ])
    utterance.text = content;
    window.speechSynthesis.speak(utterance)
    console.log("SPEAKING")
    if (suggestion) {
      setSuggestions(prevSuggestions => [...prevSuggestions, suggestion])
    }
    setResponding(false)
  }

  const getResponse = async (latest: string) => {
    const newMessages = [
      ...messages,
      {
        type: MessageType.UserMessage,
        content: latest
      }
    ]
    const res = await axios.post(`${url}/respond`, {
      scenario: chosenScenario,
      lang: chosenLang,
      nativeLang,
      messages: newMessages.map(message => {
        return {
          type: message.type === MessageType.BotMessage ? 'assistant' : 'user',
          content: message.content
        }
      })
    })
    return res.data['res'].trim()
  }

  const getTranslation = async (messageIdx: number) => {
    const message = messages[messageIdx].content
    try {
      const res = await axios.post(`${url}/translate`, {
        lang: chosenLang,
        nativeLang,
        message: message
      })

      setSuggestions(prevSuggestions => [
        ...prevSuggestions,
        't:' + res.data['res'].trim()
      ])

      windowWidth < 1001 && setCollapseSuggestion(false)

    } catch (error) {
      console.error('sorry, there was an issue translating')
    }
  }

  const clearConvo = () => {
    setMessages([])
    setSuggestions([])
  }

  const toggleMenu = () => setCollapseMenu(!collapseMenu)
  const toggleSuggestion = () => setCollapseSuggestion(!collapseSuggestion)

  

  return (
    <Layout style={{ minHeight: '100vh' }} id='layout'>
      {windowWidth < 1001 && (
        <MobileHeader
          toggleMenu={toggleMenu}
          toggleSuggestion={toggleSuggestion}
        />
      )}
      <SideMenu
        setChosenScenario={setChosenScenario}
        setChosenLang={setChosenLang}
        setNativeLang={setNativeLang}
        clearConvo={clearConvo}
        collapsed={collapseMenu}
        toggleMenu={toggleMenu}
        windowWidth={windowWidth}
      />
      <Conversation
        messages={messages}
        getTranslation={getTranslation}
        responding={responding}
        chosenLang={chosenLang}
        collapseMenu={collapseMenu}
        collapseSuggestion={collapseSuggestion}
      />
      <ConvoHelper 
        suggestions={suggestions} 
        collapsed={collapseSuggestion} 
        toggleMenu={toggleSuggestion}
        windowWidth={windowWidth}
      />
    </Layout>
  )
}

export default ChatView

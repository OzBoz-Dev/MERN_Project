// page where the messages actually happen

import ChatClient from "@/components/ChatClient";

export default function ChatPage() {
  return (
      <div className="static-grid" style={{flexDirection:"column", minHeight:"100vh"}}>
        <div style={{width:"80%", margin:"0 auto"}}>
          <ChatClient />
        </div>
      </div>
  )
}

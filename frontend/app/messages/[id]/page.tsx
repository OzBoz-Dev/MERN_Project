// page where the messages actually happen

import TextMessage from "@/components/TextMessage";
import { Button, ScrollArea } from "@mantine/core";

export default function ChatPage() {
  return (
  <div style={{
    color:"black",
    display:"flex",
    minHeight: "70vh",
    backgroundColor: "white",
    borderRadius: 3
  }}>
    <ScrollArea style={{ flex: 1, height: "100%"}}>
      afsfaf
      fasfafadf
      addfasfas
      <TextMessage author="User" timeStamp={new Date()} message="Hello"/>
    </ScrollArea>
    <Button/>
  </div>
  );
}

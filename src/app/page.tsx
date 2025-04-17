"use client";

import ContentArea from "@/components/contentArea";
import MainContainer from "@/components/mainContainer";
import PlayCard from "@/components/playCard";
import PlayList from "@/components/playList";
export default function Home() {
  return (
    <div className="w-full h-full flex items-center justify-center">
      <div className="h-full w-full flex flex-col items-center justify-center">
        <header className="w-full h-25"></header>
        <MainContainer>
          <PlayList />
          <ContentArea></ContentArea>
          <PlayCard />
        </MainContainer>
        <footer className="w-full h-25"></footer>
      </div>
    </div>
  );
}

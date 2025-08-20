
  import HomeContent from "./components/home/HomeContent"
  import ChatLocalLaunch from "@/app/components/chatbot/forlocallaunch/ChatLocalLaunch"

  const Home = () => {
    return (      
     <main className="relative min-h-screen">
      <HomeContent/>
      
      <ChatLocalLaunch />
    </main>

    )
  }  


  export default Home
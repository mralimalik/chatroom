import ChatSocketClient from "./components/ChatSocketClient";
import Navbar from "./components/Navbar/Navbar";
function App() {
  return (
    <div className="App">
      <Navbar/>
      <ChatSocketClient />

      
    </div>
  );
}

export default App;

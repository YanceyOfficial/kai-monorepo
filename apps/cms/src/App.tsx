import axios from "axios";

function App() {
  const fetchData = async () => {
    const res = await axios.post("http://127.0.0.1:3002/tts", {
      text: "你好呀",
    });

    console.log(res);
  };

  return <h1 className="text-3xl font-bold text-blue-200">Hello world!</h1>;
}

export default App;

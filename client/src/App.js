import { useState, useEffect, useRef } from 'react';
import io from 'socket.io-client'
import { Form, FormGroup, Button } from 'react-bootstrap'
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  //pass callback to init socket
  const [socket] = useState(() => io(':3001'))
  const [username, setUsername] = useState('')
  const [messages, setMessages] = useState([]);
  const ref = useRef(null)

  const animalNames = [
  "Lion",
  "Tiger",
  "Bear",
  "Dog",
  "Cat",
  "Mouse",
  "Rabbit",
  "Deer",
  "Giraffe",
  "Hippopotamus",
  "Wolf",
  "Panda",
  "Crocodile",
  "Alligator",
  "Turtle",
  "Snake",
  "Lizard",
  "Dragon",
  "Phoenix",
  "Unicorn",
  "Horse",
  "Zebra",
  "Donkey",
  "Mule",
  "Elephant",
  "Rhinoceros",
  "Gorilla",
  "Chimpanzee",
  "Orangutan",
  "Baboon",
  "Monkey",
  "Gibbon",
  "Leopard",
  "Jaguar",
  "Cheetah",
  "Panther",
  "Cougar",
  "Ocelot",
  "Toucan",
  "Penguin",
  "Ostrich",
  "Emu",
  "Kangaroo",
  "Wallaby",
  "Wombat",
  "Quokka",
  "Echidna",
  "Platypus",
  "Kiwi",
  "Duck",
  "Goose",
  "Swan",
  "Turkey",
  "Pigeon",
  "Dove",
  "Crow",
  "Raven",
  "Vulture",
  "Falcon",
  "Eagle",
  "Owl",
  "Hawk",
  "Buzzard",
  "Raccoon",
  "Fox",
  "Weasel",
  "Ferret",
  "Mink",
  "Otter",
  "Beaver",
  "Badger",
  "Wolverine",
  "Skunk",
  "Polecat",
  "Marten",
  "Ermine",
  "Sable",
  "Marmot",
  "Gopher",
  "Squirrel",
  "Chipmunk"
  ]

  const initMsg = {
    message: "",
    user: ''
  }
  const [something, setSomething] = useState(initMsg)

  useEffect(() => {
    console.log('Is this running');
    socket.on('message', (data, callback) => {
      setMessages(messages => { return ([...messages, data]) })
      callback("received")
    })
    return () => socket.off("message");
  }, [socket])

  const scrollToBottom = () => {
    ref.current?.scrollIntoView({ behavior : "smooth"})
  }

  useEffect(() => {
    scrollToBottom();
  }, [messages])

  const handleChangeName = (e) => {
    const { value } = e.target;
    setUsername(value)
  }

  const handleSubmitName = (e) => {
    e.preventDefault();
    if (username !== '') {
      setSomething({...something, user: username })
    } else {
      const animal = "Anonymous " + animalNames[Math.floor(Math.random() * animalNames.length)];
      setUsername(animal)
      setSomething({...something, user: animal })
    }
    
  }


  const handleChangeMsg = (e) => {
    const { value } = e.target;
    setSomething({ ...something, message: value })
  }

  const handleSubmitMsg = (e) => {
    e.preventDefault();
    // setSomething({...something, user: "yaus kitten"})
    if (something.message === '') {
      socket.emit("something", {...something, message: "I have decided to not send a message. I pressed send with no text in the input box."}, (res) => {
        console.log(res)
      })
      setMessages([...messages, {...something, message: "I have decided to not send a message. I pressed send with no text in the input box."}])
    } else {
      socket.emit("something", something, (res) => {
        console.log(res)
      })
      setMessages([...messages, something])
    }
    

    setSomething({ ...something, message: '' })
  }
  



  if (something.user === '') {
    return (
      <div className="App">
        <div className="splash">
          <h1>chat thingy</h1>
          <Form onSubmit={handleSubmitName} className="splash-form">
            <FormGroup className="mb-3 group-col">
              <label htmlFor="username">Set your name!</label>
              <input value={username || ''} type="text" name="username" id="username" onChange={handleChangeName} />
            </FormGroup>
            <Button variant="primary" type="submit">Set Name.</Button>
        </Form>
        </div>
      </div>
    )
  }
  else {
    return (
      <div className="App">
        <h1>chat thingy</h1>
        <h3>you are named : {username}</h3>
        <div className="message-container">
          <div id="messages">
            {messages.length !== 0
              ?
              messages.map((message, i) => {
                if (message.user === username) {
                  return (
                    <div className="message">
                      <div className="spacer"></div>
                        <div className="message-right" key={i}>
                        <p>{message.user}:</p>
                        <p>{message.message}</p>
                      </div>
                    </div>
                  )
                } else {
                  return (
                    <div className="message">
                        <div className="message-left" key={i}>
                        <p>{message.user}:</p>
                        <p>{message.message}</p>
                      </div>
                      <div className="spacer"></div>
                    </div>
                  )
                }
              })
              : <p className="message-center">no one has typed here!</p>
            }
            <div ref={ref}></div>
          </div>
          <Form onSubmit={handleSubmitMsg}>
            <FormGroup controlId="formBasicEmail" className="mb-3 group-col">
              <label htmlFor="something">Send a message!</label>
              <input value={something.message || ''} type="text" name="something" id="something" onChange={handleChangeMsg} />
            </FormGroup>
            <Button variant="primary" className="btn-sm" type="submit">Send.</Button>
          </Form>
        </div>
      </div>
    )
  }
}

export default App;

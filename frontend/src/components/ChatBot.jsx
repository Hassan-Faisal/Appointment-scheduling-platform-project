
// import React from "react";
// import { X } from "lucide-react"; // Close button icon

// const Chatbot = ({ isOpen, closeChat }) => {
//   if (!isOpen) return null;  // If the chatbot is not open, don't render anything

//   return (
//     <div className="fixed bottom-10 right-10 bg-white shadow-lg rounded-lg w-80 p-4">
//       <div className="flex justify-between items-center mb-3">
//         <h2 className="font-semibold text-lg">Chat with us</h2>
//         <button onClick={closeChat} className="text-gray-400 hover:text-gray-600">
//           <X size={20} />
//         </button>
//       </div>

//       <div className="h-56 overflow-y-auto mb-3">
//         {/* Displaying initial message */}
//         <p className="text-gray-600">Hello! How can we assist you today?</p>
//       </div>

//       <div>
//         <input
//           type="text"
//           placeholder="Type your message..."
//           className="w-full p-2 rounded-lg border border-gray-300"
//         />
//       </div>
//     </div>
//   );
// };

// export default Chatbot;


// import React, { useState } from "react";
// import { X } from "lucide-react"; // Close button icon
// import { toast } from "react-hot-toast"; // For toasts (optional, you can use your own method)

// const Chatbot = ({ isOpen, closeChat }) => {
//   if (!isOpen) return null;  // If the chatbot is not open, don't render anything

//   const [message, setMessage] = useState(""); // User's input message
//   const [messages, setMessages] = useState([
//     { text: "Hello! How can we assist you today?", isAi: true }
//   ]); // Chat history (AI and user messages)
//   const [loading, setLoading] = useState(false); // Loading state for AI response

//   // Function to handle user message and get AI response
// //   const handleSendMessage = async () => {
// //     if (!message.trim()) return; // Don't send empty messages

// //     const newUserMessage = { text: message, isAi: false };
// //     setMessages([...messages, newUserMessage]); // Add user's message to the chat

// //     setLoading(true); // Start loading

// //     try {
// //       // Call the AI API (replace with actual API call)
// //       const response = await fetch("http://localhost:8000/ai/query", {
// //         method: "POST",
// //         headers: {
// //           "Content-Type": "application/json",
// //         },
// //         body: JSON.stringify({ query: message }), // Send the user's message to the AI API
// //       });

// //       if (response.ok) {
// //         const data = await response.json();
// //         const aiMessage = { text: data.ai_response, isAi: true };
// //         setMessages([...messages, newUserMessage, aiMessage]); // Add AI response to the chat
// //       } else {
// //         toast.error("Failed to fetch AI response");
// //       }
// //     } catch (error) {
// //       console.error("Error fetching AI response:", error);
// //       toast.error("Something went wrong. Please try again.");
// //     } finally {
// //       setLoading(false); // Stop loading
// //       setMessage(""); // Clear input field
// //     }
// //   };
// const handleSendMessage = async () => {
//     if (!message.trim()) return; // Don't send empty messages
  
//     const newUserMessage = { text: message, isAi: false };
//     setMessages([...messages, newUserMessage]); // Add user's message to the chat
  
//     setLoading(true); // Start loading
  
//     try {
//       // Call the AI API (replace with actual API call)
//       const response = await fetch("http://localhost:8000/ai/query", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           query: message,  // Send the user's message
//           appointment_date: selectedDate,  // Optional, if available
//         }),
//       });
  
//       if (response.ok) {
//         const data = await response.json();
//         const aiMessage = { text: data.ai_response, isAi: true };
//         setMessages([...messages, newUserMessage, aiMessage]); // Add AI response to the chat
//       } else {
//         toast.error("Failed to fetch AI response");
//       }
//     } catch (error) {
//       console.error("Error fetching AI response:", error);
//       toast.error("Something went wrong. Please try again.");
//     } finally {
//       setLoading(false); // Stop loading
//       setMessage(""); // Clear input field
//     }
//   };
  
//   return (
//     <div className="fixed bottom-10 right-10 bg-white shadow-lg rounded-lg w-80 p-4">
//       <div className="flex justify-between items-center mb-3">
//         <h2 className="font-semibold text-lg">Chat with us</h2>
//         <button onClick={closeChat} className="text-gray-400 hover:text-gray-600">
//           <X size={20} />
//         </button>
//       </div>

//       <div className="h-56 overflow-y-auto mb-3">
//         {/* Displaying conversation */}
//         {messages.map((msg, idx) => (
//           <div key={idx} className={`mb-2 ${msg.isAi ? "text-gray-600" : "text-blue-600"}`}>
//             <p>{msg.text}</p>
//           </div>
//         ))}

//         {/* Display loading indicator */}
//         {loading && (
//           <div className="text-gray-500 text-center">AI is typing...</div>
//         )}
//       </div>

//       <div>
//         <input
//           type="text"
//           placeholder="Type your message..."
//           className="w-full p-2 rounded-lg border border-gray-300"
//           value={message}
//           onChange={(e) => setMessage(e.target.value)}
//           onKeyPress={(e) => e.key === "Enter" && handleSendMessage()} // Trigger send on enter
//         />
//         <button
//           onClick={handleSendMessage}
//           disabled={loading}
//           className="w-full p-2 mt-2 bg-blue-500 text-white rounded-lg"
//         >
//           {loading ? "Sending..." : "Send"}
//         </button>
//       </div>
//     </div>
//   );
// };

// export default Chatbot;



import React, { useState } from "react";
import { X } from "lucide-react"; // Close button icon
import { toast } from "react-hot-toast"; // For toasts (optional, you can use your own method)
import { sendQueryToAI } from "../api/ai"; // Import the sendQueryToAI function

const Chatbot = ({ isOpen, closeChat, selectedDate }) => {
  if (!isOpen) return null;  // If the chatbot is not open, don't render anything

  const [message, setMessage] = useState(""); // User's input message
  const [messages, setMessages] = useState([ // Chat history (AI and user messages)
    { text: "Hello! How can we assist you today?", isAi: true }
  ]);
  const [loading, setLoading] = useState(false); // Loading state for AI response

  // Function to handle user message and get AI response
  const handleSendMessage = async () => {
    if (!message.trim()) return; // Don't send empty messages

    const newUserMessage = { text: message, isAi: false };
    setMessages((prevMessages) => [...prevMessages, newUserMessage]); // Add user's message to the chat

    setLoading(true); // Start loading

    try {
      // Call the AI API (using sendQueryToAI function from api.js)
      const aiResponse = await sendQueryToAI(message, selectedDate);
      console.log("AI Response:", aiResponse); // Log AI response to check its structure

      // Assuming the response has a field 'answer' that contains the message to be displayed
      const aiMessageText = aiResponse || "Sorry, I didn't get that."; // Default message if no response

      const aiMessage = { text: aiMessageText, isAi: true };
      setMessages((prevMessages) => [...prevMessages, newUserMessage, aiMessage]); // Add AI response to the chat
    } catch (error) {
      toast.error(error.message); // Show error if the API call fails
    } finally {
      setLoading(false); // Stop loading
      setMessage(""); // Clear input field
    }
  };

  return (
    <div className="fixed bottom-10 right-10 bg-white shadow-lg rounded-lg w-80 p-4">
      <div className="flex justify-between items-center mb-3">
        <h2 className="font-semibold text-lg">Chat with us</h2>
        <button onClick={closeChat} className="text-gray-400 hover:text-gray-600">
          <X size={20} />
        </button>
      </div>

      <div className="h-56 overflow-y-auto mb-3">
        {/* Displaying conversation */}
        {messages.map((msg, idx) => (
          <div key={idx} className={`mb-2 ${msg.isAi ? "text-gray-600" : "text-blue-600"}`}>
            <p>{msg.text}</p>
          </div>
        ))}

        {/* Display loading indicator */}
        {loading && (
          <div className="text-gray-500 text-center">AI is typing...</div>
        )}
      </div>

      <div>
        <input
          type="text"
          placeholder="Type your message..."
          className="w-full p-2 rounded-lg border border-gray-300"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyPress={(e) => e.key === "Enter" && handleSendMessage()} // Trigger send on enter
        />
        <button
          onClick={handleSendMessage}
          disabled={loading}
          className="w-full p-2 mt-2 bg-blue-500 text-white rounded-lg"
        >
          {loading ? "Sending..." : "Send"}
        </button>
      </div>
    </div>
  );
};

export default Chatbot;



// import React, { useState } from "react";
// import { X } from "lucide-react"; // Close button icon
// import { toast } from "react-hot-toast"; // For toasts (optional, you can use your own method)
// import { sendQueryToAI } from "../api/ai"; // Import the sendQueryToAI function

// const Chatbot = ({ isOpen, closeChat, selectedDate }) => {
//   if (!isOpen) return null;  // If the chatbot is not open, don't render anything

//   const [message, setMessage] = useState(""); // User's input message
//   const [messages, setMessages] = useState([ // Chat history (AI and user messages)
//     { text: "Hello! How can we assist you today?", isAi: true }
//   ]);
//   const [loading, setLoading] = useState(false); // Loading state for AI response

//   // Function to handle user message and get AI response
//   const handleSendMessage = async () => {
//     if (!message.trim()) return; // Don't send empty messages

//     const newUserMessage = { text: message, isAi: false };
//     setMessages([...messages, newUserMessage]); // Add user's message to the chat

//     setLoading(true); // Start loading

//     try {
//       // Call the AI API (using sendQueryToAI function from api.js)
//       const aiResponse = await sendQueryToAI(message, selectedDate);
//       console.log("AI Response:", aiResponse); // Log AI response to check its structure

//       // Assuming the response has a field 'answer' that contains the message to be displayed
//       const aiMessageText = aiResponse?.answer || "Sorry, I didn't get that."; // Default message if no response

//       const aiMessage = { text: aiMessageText, isAi: true };
//       setMessages([...messages, newUserMessage, aiMessage]); // Add AI response to the chat
//     } catch (error) {
//       toast.error(error.message); // Show error if the API call fails
//     } finally {
//       setLoading(false); // Stop loading
//       setMessage(""); // Clear input field
//     }
//   };

//   return (
//     <div className="fixed bottom-10 right-10 bg-white shadow-lg rounded-lg w-80 p-4">
//       <div className="flex justify-between items-center mb-3">
//         <h2 className="font-semibold text-lg">Chat with us</h2>
//         <button onClick={closeChat} className="text-gray-400 hover:text-gray-600">
//           <X size={20} />
//         </button>
//       </div>

//       <div className="h-56 overflow-y-auto mb-3">
//         {/* Displaying conversation */}
//         {messages.map((msg, idx) => (
//           <div key={idx} className={`mb-2 ${msg.isAi ? "text-gray-600" : "text-blue-600"}`}>
//             <p>{msg.text}</p>
//           </div>
//         ))}

//         {/* Display loading indicator */}
//         {loading && (
//           <div className="text-gray-500 text-center">AI is typing...</div>
//         )}
//       </div>

//       <div>
//         <input
//           type="text"
//           placeholder="Type your message..."
//           className="w-full p-2 rounded-lg border border-gray-300"
//           value={message}
//           onChange={(e) => setMessage(e.target.value)}
//           onKeyPress={(e) => e.key === "Enter" && handleSendMessage()} // Trigger send on enter
//         />
//         <button
//           onClick={handleSendMessage}
//           disabled={loading}
//           className="w-full p-2 mt-2 bg-blue-500 text-white rounded-lg"
//         >
//           {loading ? "Sending..." : "Send"}
//         </button>
//       </div>
//     </div>
//   );
// };

// export default Chatbot;


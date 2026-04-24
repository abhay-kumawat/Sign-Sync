from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel
from memory import ConversationMemory
import random

app = FastAPI(title="SignSync API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

memory = ConversationMemory()

GESTURE_RESPONSES = {
    "Hello":     ["Hello! Great to see you! 😊", "Hi there! Welcome to SignSync!", "Hey! How can I help you today?"],
    "Thank You": ["You're very welcome! 😊", "My pleasure! Happy to help!", "Anytime! That's what I'm here for!"],
    "Help":      ["Of course! What do you need help with?", "I'm here to assist! What's your question?", "Sure! Let me help you!"],
    "Yes":       ["Great! Let's proceed! ✅", "Perfect! I'll take that as a yes!", "Wonderful! Moving forward!"],
    "No":        ["No problem at all! 👍", "Understood! Let me know what you'd prefer.", "Got it! What would you like instead?"],
    "Please":    ["Of course! Happy to help! 😊", "Sure thing! What do you need?", "Absolutely! What can I do for you?"],
    "Sorry":     ["No worries at all! 😊", "That's totally okay! Don't worry about it.", "It's alright! We all make mistakes."],
    "Good":      ["That's wonderful to hear! 🌟", "Excellent! Keep it up!", "Great job! I'm proud of you!"],
    "Name":      ["I'm Stacy — your emotionally intelligent AI sign language assistant!", "My name is Stacy! Nice to meet you!", "I'm Stacy, here to help you communicate!"],
    # Numbers
    "1":         ["You showed 1! ☝️", "Perfect! I see 1! 👆", "Great! That's the number 1!"],
    "2":         ["You showed 2! ✌️", "I got 2! Peace!", "Excellent! That's 2 fingers!"],
    "3":         ["You showed 3! 🤟", "Three fingers up! 🤟", "That's 3!"],
    "4":         ["You showed 4! ✋", "Four fingers visible!", "That's 4 fingers!"],
    "5":         ["You showed 5! ✋", "All fingers up! Great!", "That's 5 fingers!"],
    # ASL Letters
    "A":         ["Letter A! 👊", "Perfect A! Great job!", "I see the letter A!"],
    "B":         ["Letter B! 🖐️", "That's a B! Well done!", "I detected B!"],
    "C":         ["Letter C! ✊", "Perfect C shape! Nice!", "I see C!"],
    "D":         ["Letter D! ☝️", "That's D! Excellent!", "I got D!"],
    "E":         ["Letter E! ✊", "E is correct! 👏", "I see E!"],
    "F":         ["Letter F! 🤏", "Perfect F! Great sign!", "I detected F!"],
    "G":         ["Letter G! 🫰", "That's G! Nice work!", "I see G!"],
    "H":         ["Letter H! ✌️", "H is perfect!", "I got H!"],
    "I":         ["Letter I! 🤟", "Perfect I! Well done!", "I see I!"],
    "J":         ["Letter J! 👉", "That's J! Excellent!", "I detected J!"],
    "K":         ["Letter K! 🤘", "Perfect K shape!", "I see K!"],
    "L":         ["Letter L! 👍", "That's L! Great job!", "I got L!"],
    "M":         ["Letter M! 👊", "Perfect M! Nice!", "I see M!"],
    "N":         ["Letter N! ✌️", "That's N! Well done!", "I detected N!"],
    "O":         ["Letter O! 🫠", "Perfect O! Excellent!", "I see O!"],
    "P":         ["Letter P! 🤏", "That's P! Great work!", "I got P!"],
    "Q":         ["Letter Q! 👉", "Perfect Q shape!", "I see Q!"],
    "R":         ["Letter R! ✌️", "That's R! Excellent!", "I detected R!"],
    "S":         ["Letter S! ✊", "Perfect S! Nice job!", "I see S!"],
    "T":         ["Letter T! 👊", "That's T! Well done!", "I got T!"],
    "U":         ["Letter U! ✌️", "Perfect U! Great!", "I see U!"],
    "V":         ["Letter V! ✌️", "That's V! Excellent!", "I detected V!"],
    "W":         ["Letter W! 🖐️", "Perfect W shape!", "I see W!"],
    "X":         ["Letter X! ✊", "That's X! Nice work!", "I got X!"],
    "Y":         ["Letter Y! 🤟", "Perfect Y! Great job!", "I see Y!"],
    "Z":         ["Letter Z! ✌️", "That's Z! Well done!", "I detected Z!"],
}

class GestureRequest(BaseModel):
    gesture: str
    emotion: str = "neutral"
    session_id: str = "default"

class TextRequest(BaseModel):
    text: str
    emotion: str = "neutral"
    session_id: str = "default"

@app.get("/")
def root():
    return {"status": "SignSync API running", "version": "1.0.0"}

@app.post("/api/gesture")
def process_gesture(req: GestureRequest):
    memory.add(req.session_id, "user", f"[GESTURE] {req.gesture}")
    
    replies = GESTURE_RESPONSES.get(req.gesture, [
        f'I detected your sign: "{req.gesture}". Keep practicing! 🌟',
        f'You signed "{req.gesture}" — great job! 💪',
        f'Nice sign! "{req.gesture}" recognized successfully!',
    ])
    reply = random.choice(replies)
    
    # Adapt tone to emotion
    if req.emotion == "sad":
        reply += " I can see you might be feeling down — I'm here for you! 💙"
    elif req.emotion == "happy":
        reply += " Your energy is amazing! 🌟"
    
    memory.add(req.session_id, "ai", reply)
    
    return {
        "reply": reply,
        "gesture": req.gesture,
        "emotion": req.emotion,
        "history_length": memory.length(req.session_id),
    }

@app.post("/api/chat")
def chat(req: TextRequest):
    memory.add(req.session_id, "user", req.text)
    
    text = req.text.lower()
    if any(w in text for w in ["hello", "hi", "hey"]):
        reply = "Hello! Great to meet you! How can I assist you today? 👋"
    elif "name" in text:
        reply = "I'm Stacy — your emotionally intelligent AI sign language assistant! 🤖"
    elif any(w in text for w in ["help", "how"]):
        reply = "I can help you learn sign language! Show me a gesture using your camera, or type your question here. 💡"
    elif any(w in text for w in ["thank", "thanks"]):
        reply = "You're very welcome! That's what I'm here for! 😊"
    elif any(w in text for w in ["bye", "goodbye"]):
        reply = "Goodbye! Keep practicing your signs! See you soon! 👋"
    else:
        history = memory.get_context(req.session_id)
        reply = f'I understood: "{req.text}". I\'m here to help you communicate through sign language! 🌟'
    
    memory.add(req.session_id, "ai", reply)
    return {"reply": reply, "emotion": req.emotion}

@app.get("/api/history/{session_id}")
def get_history(session_id: str):
    return {"history": memory.get(session_id)}

@app.delete("/api/history/{session_id}")
def clear_history(session_id: str):
    memory.clear(session_id)
    return {"status": "cleared"}

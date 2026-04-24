from collections import defaultdict
from datetime import datetime

class ConversationMemory:
    def __init__(self, max_history: int = 20):
        self._store = defaultdict(list)
        self._max = max_history

    def add(self, session_id: str, role: str, text: str):
        self._store[session_id].append({
            "role": role,
            "text": text,
            "timestamp": datetime.utcnow().isoformat(),
        })
        # Trim to max
        if len(self._store[session_id]) > self._max:
            self._store[session_id] = self._store[session_id][-self._max:]

    def get(self, session_id: str):
        return self._store.get(session_id, [])

    def get_context(self, session_id: str, last_n: int = 5) -> str:
        history = self._store.get(session_id, [])[-last_n:]
        return "\n".join(f"{m['role'].upper()}: {m['text']}" for m in history)

    def length(self, session_id: str) -> int:
        return len(self._store.get(session_id, []))

    def clear(self, session_id: str):
        self._store[session_id] = []

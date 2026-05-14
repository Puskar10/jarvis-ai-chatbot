const API_URL = "http://localhost:5000";

/* ================= AUTH ================= */

export const registerUser = async (name, email, password) => {
  const res = await fetch(`${API_URL}/auth/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      name,
      email,
      password,
    }),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.error || "Registration failed");
  }

  localStorage.setItem("token", data.token);
  localStorage.setItem("user", JSON.stringify(data.user));

  return data;
};

export const loginUser = async (email, password) => {
  const res = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email,
      password,
    }),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.error || "Login failed");
  }

  localStorage.setItem("token", data.token);
  localStorage.setItem("user", JSON.stringify(data.user));

  return data;
};

/* ================= CHAT ================= */

export const sendToAI = async (message, conversationId = null) => {
  const user = JSON.parse(localStorage.getItem("user"));

  if (!user) {
    throw new Error("User not logged in");
  }

  const res = await fetch(`${API_URL}/chat`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      userId: user.id,
      message,
      conversationId,
    }),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.error || "Something went wrong");
  }

  return data;
};

/* ================= CONVERSATIONS ================= */

export const getConversations = async () => {
  const user = JSON.parse(localStorage.getItem("user"));

  if (!user) {
    throw new Error("User not logged in");
  }

  const res = await fetch(`${API_URL}/conversations/user/${user.id}`);

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.error || "Failed to fetch conversations");
  }

  return data;
};

export const getConversationMessages = async (conversationId) => {
  const res = await fetch(
    `${API_URL}/conversations/${conversationId}/messages`
  );

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.error || "Failed to fetch messages");
  }

  return data;
};

export const deleteConversationFromDB = async (conversationId) => {
  const res = await fetch(`${API_URL}/conversations/${conversationId}`, {
    method: "DELETE",
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.error || "Failed to delete conversation");
  }

  return data;
};
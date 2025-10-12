// Authentication API
export const authAPI = {
  registerUser: async (data: {
    name: string;
    phoneNumber: string;
    password: string;
    emergencyContactName: string;
    emergencyContactPhone: string;
  }) => {
    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error(await res.text());
    return res.json();
  },

  loginUser: async (phoneNumber: string, password: string) => {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phoneNumber, password }),
    });
    if (!res.ok) throw new Error(await res.text());
    return res.json();
  },
};

// Hospital API
export const hospitalAPI = {
  register: async (data: {
    name: string;
    email: string;
    password: string;
    address: string;
    phoneNumber: string;
  }) => {
    const res = await fetch('/api/hospital/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error(await res.text());
    return res.json();
  },

  login: async (email: string, password: string) => {
    const res = await fetch('/api/hospital/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    if (!res.ok) throw new Error(await res.text());
    return res.json();
  },
};

// Doctor API
export const doctorAPI = {
  register: async (data: {
    name: string;
    email: string;
    password: string;
    specialization: string;
    hospitalId: string;
    phoneNumber: string;
  }) => {
    const res = await fetch('/api/doctor/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error(await res.text());
    return res.json();
  },

  login: async (email: string, password: string) => {
    const res = await fetch('/api/doctor/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    if (!res.ok) throw new Error(await res.text());
    return res.json();
  },

  getOnline: async () => {
    const res = await fetch('/api/doctors/online');
    if (!res.ok) throw new Error(await res.text());
    return res.json();
  },
};

// Chat API
export const chatAPI = {
  createRoom: async (userId: string, doctorId: string, token: string) => {
    const res = await fetch('/api/chat/room', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ userId, doctorId }),
    });
    if (!res.ok) throw new Error(await res.text());
    return res.json();
  },

  getUserRooms: async (userId: string, token: string) => {
    const res = await fetch(`/api/chat/rooms/user/${userId}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    if (!res.ok) throw new Error(await res.text());
    return res.json();
  },

  getDoctorRooms: async (doctorId: string, token: string) => {
    const res = await fetch(`/api/chat/rooms/doctor/${doctorId}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    if (!res.ok) throw new Error(await res.text());
    return res.json();
  },

  getMessages: async (chatRoomId: string, token: string) => {
    const res = await fetch(`/api/chat/messages/${chatRoomId}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    if (!res.ok) throw new Error(await res.text());
    return res.json();
  },
};

// Posts API
export const postsAPI = {
  create: async (authorId: string, authorName: string, content: string, token: string) => {
    const res = await fetch('/api/posts', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ authorId, authorName, content }),
    });
    if (!res.ok) throw new Error(await res.text());
    return res.json();
  },

  getAll: async () => {
    const res = await fetch('/api/posts');
    if (!res.ok) throw new Error(await res.text());
    return res.json();
  },
};

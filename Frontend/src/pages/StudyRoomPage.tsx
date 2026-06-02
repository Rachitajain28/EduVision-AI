import { useState, useEffect } from "react";
import { Plus, Users, Link2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
const API_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";

const StudyRoomPage = () => {
    const [roomCode, setRoomCode] = useState("");
    const [roomName, setRoomName] = useState("");
    const [createdLink, setCreatedLink] = useState("");
    const [rooms, setRooms] = useState<any[]>([]);
    const navigate = useNavigate();
    useEffect(() => {
        fetch(`${API_URL}/rooms`)
            .then(res => res.json())
            .then(data => setRooms(data));
    }, []);

    // ✅ YEH NICHE likhna hai (state ke bahar)
    const handleCreateRoom = async () => {
        const res = await fetch(`${API_URL}/rooms`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ name: roomName || `Room ${rooms.length + 1}` })
        });

        const data = await res.json();
        const roomLink = `http://localhost:8080/dashboard/room/${data.code}`;

        setCreatedLink(roomLink);   // 👈 link store
        setRoomName("");
        // navigator.clipboard.writeText(roomLink);
        // alert("Room link copied 🔥 Share with friends!");
        if (!rooms.some(room => room.code === data.code)) {
            setRooms(prev => [...prev, data]);
        }
    };

    const handleDeleteRoom = async (code: string) => {
        await fetch(`${API_URL}/rooms/${code}`, {
            method: "DELETE"
        });

        setRooms(rooms.filter(room => room.code !== code));
    };

    const handleJoinRoom = async () => {
        if (!roomCode) return;

        const res = await fetch(`${API_URL}/rooms/join`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ code: roomCode })
        });

        const data = await res.json();

        if (data.error) {
            alert("Room not found ❌");
        } else {
            setRooms([...rooms, data]);
        }

        setRoomCode("");
    };
    return (
        <div className="p-6 text-white space-y-6">

            {/* 🔥 Header */}
            <div>
                <h1 className="text-2xl font-bold">Study Rooms</h1>
                <p className="text-muted-foreground">
                    Create or join rooms with your friends 🚀
                </p>
            </div>

            {/* 🔥 Actions */}
            <div className="flex flex-col md:flex-row gap-4">
                {/* 👇 IF room created → show link */}
                {createdLink ? (
                    <div className="flex gap-2 items-center">

                        <input
                            value={createdLink}
                            readOnly
                            className="px-4 py-3 rounded-xl bg-muted text-white w-[300px]"
                        />

                        <button
                            onClick={() => {
                                navigator.clipboard.writeText(createdLink);
                                alert("Link copied 🔥");
                            }}
                            className="px-4 py-3 rounded-xl bg-green-500"
                        >
                            Copy
                        </button>

                    </div>
                ) : (
                    <>
                        {/* 👇 Normal create flow */}
                        <input
                            type="text"
                            placeholder="Enter room name..."
                            value={roomName}
                            onChange={(e) => setRoomName(e.target.value)}
                            className="px-4 py-3 rounded-xl bg-muted text-white"
                        />

                        <button
                            onClick={handleCreateRoom}
                            className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl gradient-primary font-medium"
                        >
                            <Plus className="w-5 h-5" />
                            Create Room
                        </button>
                    </>
                )}

              
                {/* Join Room */}
                <div className="flex gap-2 w-full md:w-auto">
                    <input
                        type="text"
                        placeholder="Enter room code..."
                        value={roomCode}
                        onChange={(e) => setRoomCode(e.target.value)}
                        className="px-4 py-3 rounded-xl bg-muted text-white outline-none w-full"
                    />
                    <button onClick={handleJoinRoom} className="px-4 py-3 rounded-xl bg-blue-500 hover:bg-blue-600 transition">
                        Join
                    </button>
                </div>
            </div>

            {/* 🔥 Room List */}
            <div>
                <h2 className="text-lg font-semibold mb-3">Your Rooms</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">

                    {/* Room Card */}
                    {rooms.map((room, index) => (
                        <div key={index} className="p-4 rounded-2xl glass-card-strong border border-border/30 hover:scale-105 transition">

                            <div className="flex items-center justify-between">
                                <h3 className="font-semibold text-lg">{room.name}</h3>
                                <Users className="w-5 h-5 text-muted-foreground" />
                            </div>

                            <p className="text-sm text-muted-foreground mt-2">
                                {room.members} members
                            </p>

                            <div className="mt-4 flex items-center justify-between">
                                <span className="text-xs bg-muted px-2 py-1 rounded">
                                    Code: {room.code}
                                </span>

                                <button
                                    onClick={() => navigate(`/dashboard/room/${room.code}`)}
                                    className="flex items-center gap-1 text-sm hover:text-blue-400"
                                >
                                    <Link2 className="w-4 h-4" />
                                    Open
                                </button>
                                <button
                                    onClick={() => handleDeleteRoom(room.code)}
                                    className="text-red-400 text-sm hover:text-red-600 ml-2"
                                >
                                    Delete
                                </button>
                            </div>

                        </div>
                    ))}

                </div>

            </div>
        </div>
    );
};

export default StudyRoomPage;
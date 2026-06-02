import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";

const API_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";

const RoomDetailPage = () => {
    const { code } = useParams();
    const [room, setRoom] = useState<any>(null);

    useEffect(() => {
        if (!code) return;

        // 👇 AUTO JOIN
        fetch(`${API_URL}/rooms/join`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ code })
        })
        .then(res => res.json())
        .then(data => {
            if (data.error) {
                alert("Room not found ❌");
            } else {
                setRoom(data);
            }
        });
    }, [code]);

    if (!room) return <p className="p-6 text-white">Loading...</p>;

    return (
        <div className="p-6 text-white">
            <h1 className="text-2xl font-bold">{room.name}</h1>
            <p className="text-muted-foreground">Code: {room.code}</p>
            <p>{room.members} members</p>

            <div className="mt-6">
                <h2 className="text-lg font-semibold">Notes (Coming Soon 🔥)</h2>
            </div>
        </div>
    );
};

export default RoomDetailPage;
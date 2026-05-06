import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { updateCard } from "./cardService";
import { useNavigate } from "react-router-dom";
import { useAuth } from '../../hooks/useAuth';

const OWNED_CARD_IDS_KEY = 'ownedCardIds';

const readOwnedCardIds = () => {
    try {
        return JSON.parse(localStorage.getItem(OWNED_CARD_IDS_KEY) || '[]').map(String);
    } catch (err) {
        return [];
    }
};

function EditCard({ card, onUpdate }) {
    const { user } = useAuth();
    const { register, handleSubmit } = useForm({
        defaultValues: {
            title: card.title,
            description: card.description
        }
    });

    const navigate = useNavigate();


    const [preview, setPreview] = useState(card.imageUrl);
    const [loading, setLoading] = useState(false);

    const getUserIdentity = (currentUser) => {
        if (!currentUser) return '';

        return String(
            currentUser.username ||
            currentUser.sub ||
            currentUser.email ||
            currentUser.id ||
            currentUser.userId ||
            ''
        );
    };

    const getCardOwnerIdentity = (currentCard) => {
        if (!currentCard) return '';

        return String(
            currentCard.ownerUsername ||
            currentCard.username ||
            currentCard.createdBy ||
            currentCard.author ||
            currentCard.owner?.username ||
            currentCard.user?.username ||
            currentCard.ownerId ||
            currentCard.createdById ||
            currentCard.userId ||
            currentCard.owner?.id ||
            currentCard.user?.id ||
            ''
        );
    };

    const currentUserIdentity = getUserIdentity(user);
    const cardOwnerIdentity = getCardOwnerIdentity(card);
    const cardId = String(card?.id || card?._id || card?.cardId || '');
    const isOwner = (currentUserIdentity && currentUserIdentity === cardOwnerIdentity) || readOwnedCardIds().includes(cardId);

    if (!isOwner) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 px-4" dir="ltr">
                <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-2xl text-center">
                    <h2 className="text-2xl font-bold text-gray-800">You do not have permission</h2>
                    <p className="mt-3 text-gray-600">Only the owner of this card can edit it.</p>
                    <button
                        onClick={() => navigate("/cards")}
                        className="mt-6 rounded-lg bg-blue-600 px-5 py-3 font-medium text-white hover:bg-blue-700 transition"
                    >
                        Back to cards
                    </button>
                </div>
            </div>
        );
    }

    const handleImageChange = (e) => {
        const file = e.target.files[0];

        if (file) {
            setPreview(URL.createObjectURL(file)); // preview new image
        }
    };

    const onSubmit = async (data) => {
        try {
            setLoading(true);

            const formData = new FormData();
            formData.append("title", data.title);
            formData.append("description", data.description);

            if (data.image?.[0]) {
                formData.append("image", data.image[0]);
            }

            const updated = await updateCard(card.id, formData);

            onUpdate(updated);  // update UI

            navigate("/cards");

        } catch (err) {
            console.error(err);
            alert("Update failed");
        } finally {
            setLoading(false);
        }
    };



    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center px-4" dir="ltr">
            <div className="max-w-md w-full p-6 bg-white shadow rounded-xl">
                <h2 className="text-xl font-bold mb-4">Edit Card</h2>

                <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-3">

                <input
                    {...register("title")}
                    className="border p-2 rounded"
                />

                <textarea
                    {...register("description")}
                    className="border p-2 rounded"
                />

                <input
                    type="file"
                    {...register("image")}
                    onChange={handleImageChange}
                />

                {/* 🔥 Image preview */}
                {preview && (
                    <img
                        src={preview}
                        alt="preview"
                        className="h-40 object-cover rounded"
                    />
                )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="bg-green-500 text-white py-2 rounded"
                    >
                        {loading ? "Updating..." : "Update Card"}
                    </button>

                </form>
            </div>
        </div>
    );
}

export default EditCard;
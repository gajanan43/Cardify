import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { createCard } from "./cardService";
import { useNavigate } from "react-router-dom";

const OWNED_CARD_IDS_KEY = 'ownedCardIds';

const readOwnedCardIds = () => {
  try {
    return JSON.parse(localStorage.getItem(OWNED_CARD_IDS_KEY) || '[]');
  } catch (err) {
    return [];
  }
};

const addOwnedCardId = (cardId) => {
  if (!cardId) return;

  const nextIds = new Set(readOwnedCardIds().map(String));
  nextIds.add(String(cardId));
  localStorage.setItem(OWNED_CARD_IDS_KEY, JSON.stringify(Array.from(nextIds)));
};

function AddCard() {
  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  const navigate = useNavigate();

  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);

  // image preview handler
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPreview(URL.createObjectURL(file));
    }
  };

  const onSubmit = async (data) => {
    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("title", data.title);
      formData.append("description", data.description);
      formData.append("image", data.image[0]);

      const createdCard = await createCard(formData);
      addOwnedCardId(createdCard?.id || createdCard?._id || createdCard?.cardId);

      reset();
      setPreview(null);

      navigate("/cards", {
        state: { message: "Card created successfully!" }
      });
    } catch (error) {
      alert("Failed to create card");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white shadow rounded-xl">
      <h2 className="text-xl font-bold mb-4">Add New Card</h2>

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-3">

        {/* Title */}
        <input
          type="text"
          placeholder="Title"
          {...register("title", { required: "Title is required" })}
          className="border p-2 rounded"
        />
        {errors.title && <p className="text-red-500">{errors.title.message}</p>}

        {/* Description */}
        <textarea
          placeholder="Description"
          {...register("description", { required: "Description is required" })}
          className="border p-2 rounded"
        />
        {errors.description && <p className="text-red-500">{errors.description.message}</p>}

        {/* Image */}
        <input
          type="file"
          {...register("image", { required: "Image is required" })}
          onChange={handleImageChange}
        />
        {errors.image && <p className="text-red-500">{errors.image.message}</p>}

        {/* Preview */}
        {preview && (
          <img
            src={preview}
            alt="preview"
            className="h-40 object-cover rounded"
          />
        )}

        {/* Button */}
        <button
          type="submit"
          disabled={loading}
          className="bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
        >
          {loading ? "Uploading..." : "Add Card"}
        </button>

      </form>
    </div>
  );
}

export default AddCard;
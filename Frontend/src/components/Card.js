import React from 'react'

function Card({ item, onDelete, onEdit, canEdit, canDelete }) {
  return (
    <div className="bg-white shadow-lg rounded-xl p-5 w-80 hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
      <img
        src={item.imageUrl}
        alt={item.title}
        className="w-full h-48 object-cover rounded-lg mb-3 hover:opacity-90 transition"
      />

      <h2 className="text-xl font-bold mt-3 mb-2 text-gray-800">{item.title}</h2>
      <p className="text-gray-600 text-sm mb-4 line-clamp-2">{item.description}</p>

      {canEdit || canDelete ? (
        <div className="flex gap-2">
          {canEdit && (
            <button
              onClick={() => onEdit(item)}
              className="flex-1 bg-gradient-to-r from-yellow-400 to-yellow-500 text-white px-3 py-2 rounded-lg font-medium hover:from-yellow-500 hover:to-yellow-600 transition shadow-md"
            >
              Edit
            </button>
          )}

          {canDelete && (
            <button
              onClick={() => onDelete(item.id)}
              className="flex-1 bg-gradient-to-r from-red-500 to-red-600 text-white px-3 py-2 rounded-lg font-medium hover:from-red-600 hover:to-red-700 transition shadow-md"
            >
              Delete
            </button>
          )}
        </div>
      ) : (
        <div className="mt-4 rounded-lg bg-gray-50 px-3 py-2 text-center text-sm text-gray-500">
          View only
        </div>
      )}
    </div>
  );
}

export default Card
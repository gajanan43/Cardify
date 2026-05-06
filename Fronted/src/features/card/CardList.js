import React from 'react'
import Card from '../../components/Card'
import { useEffect, useState, useRef } from "react";
import { getCards } from './cardService';
import { deleteCard } from './cardService';
import EditCard from './EditCard';
import { useAuth } from '../../hooks/useAuth';
import { useNavigate } from 'react-router-dom';

const OWNED_CARD_IDS_KEY = 'ownedCardIds';

const readOwnedCardIds = () => {
    try {
        return JSON.parse(localStorage.getItem(OWNED_CARD_IDS_KEY) || '[]').map(String);
    } catch (err) {
        return [];
    }
};

const removeOwnedCardId = (cardId) => {
    const nextIds = readOwnedCardIds().filter((existingId) => String(existingId) !== String(cardId));
    localStorage.setItem(OWNED_CARD_IDS_KEY, JSON.stringify(nextIds));
};

function CardList() {
    const { token, user, logout } = useAuth();
    const navigate = useNavigate();
    const scrollContainerRef = useRef(null);
    const touchStartX = useRef(0);
    const touchEndX = useRef(0);

    const [cards, setCards] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editingCard, setEditingCard] = useState(null);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [error, setError] = useState('');

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

    const getCardOwnerIdentity = (card) => {
        if (!card) return '';

        return String(
            card.ownerUsername ||
            card.username ||
            card.createdBy ||
            card.author ||
            card.owner?.username ||
            card.user?.username ||
            card.ownerId ||
            card.createdById ||
            card.userId ||
            card.owner?.id ||
            card.user?.id ||
            ''
        );
    };

    const isOwnedLocally = (card) => {
        if (!card) return false;

        const ownedCardIds = readOwnedCardIds();
        const cardId = String(card.id || card._id || card.cardId || '');

        return ownedCardIds.includes(cardId);
    };

    const canManageCard = (card) => {
        const currentUserIdentity = getUserIdentity(user);
        const cardOwnerIdentity = getCardOwnerIdentity(card);

        if (cardOwnerIdentity && currentUserIdentity) {
            return currentUserIdentity === cardOwnerIdentity;
        }

        return isOwnedLocally(card);
    };

    useEffect(() => {
        if (!token) return;

        const fetchData = async () => {
            try {
                setError('');
                setLoading(true);
                const data = await getCards();
                setCards(data);

            } catch (err) {
                console.error("Error:", err);
                if (err?.status === 401 || err?.status === 403) {
                    logout();
                    navigate('/login', { replace: true });
                    return;
                }
                setError(err.message || 'Failed to load cards');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [token]);


    const handleDelete = async (id) => {
        try {
            const card = cards.find((item) => item.id === id);
            if (!canManageCard(card)) {
                alert('Only the owner can delete this card.');
                return;
            }

            await deleteCard(id);
            removeOwnedCardId(id);
            setCards((prev) => prev.filter((card) => card.id !== id));
        } catch (err) {
            console.error(err);
        }
    };

    const handleEdit = (card) => {
        if (!canManageCard(card)) {
            alert('Only the owner can edit this card.');
            return;
        }

        setEditingCard(card);
    };

    const handleUpdate = (updatedCard) => {
        setCards(prev =>
            prev.map(card =>
                card.id === updatedCard.id ? updatedCard : card
            )
        );
        setEditingCard(null);
    };

    // Handle touch swipe
    const handleTouchStart = (e) => {
        touchStartX.current = e.changedTouches[0].screenX;
    };

    const handleTouchEnd = (e) => {
        touchEndX.current = e.changedTouches[0].screenX;
        handleSwipe();
    };

    const handleSwipe = () => {
        const swipeThreshold = 50;
        const diff = touchStartX.current - touchEndX.current;

        if (Math.abs(diff) > swipeThreshold) {
            if (diff > 0) {
                // Swiped left - show next card
                scrollToCard(currentIndex + 1);
            } else {
                // Swiped right - show previous card
                scrollToCard(currentIndex - 1);
            }
        }
    };

    const scrollToCard = (index) => {
        if (index < 0 || index >= cards.length) return;

        setCurrentIndex(index);

        if (scrollContainerRef.current) {
            const container = scrollContainerRef.current;
            const cardWidth = 340; // Card width + gap
            const scrollAmount = index * cardWidth;

            container.scrollTo({
                left: scrollAmount,
                behavior: 'smooth'
            });
        }
    };

    const scrollLeft = () => {
        scrollToCard(currentIndex - 1);
    };

    const scrollRight = () => {
        scrollToCard(currentIndex + 1);
    };

    return (
        <>
            {editingCard ? (
                <EditCard
                    card={editingCard}
                    onUpdate={handleUpdate}
                />
            ) : (
                <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex flex-col items-center justify-start overflow-hidden pt-6 pb-8">
                    
                    {/* Header */}
                    <div className="w-full text-center z-20 mb-6 pt-4">
                        <p className="text-gray-600 text-sm">Card {currentIndex + 1} of {cards.length}</p>
                    </div>

                    {loading ? (
                        <div className="flex items-center justify-center">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                        </div>
                    ) : error ? (
                        <div className="max-w-xl rounded-2xl border border-red-200 bg-red-50 px-6 py-5 text-center text-red-700 shadow-sm">
                            <h3 className="text-lg font-semibold">Cannot load cards</h3>
                            <p className="mt-2 text-sm">{error}</p>
                        </div>
                    ) : cards.length === 0 ? (
                        <div className="text-center">
                            <p className="text-lg text-gray-600">No cards yet. Create one to get started!</p>
                        </div>
                    ) : (
                        <div className="relative w-full flex-1 flex items-center justify-center min-h-[calc(100vh-10rem)]">
                            {/* Card Display */}
                            <div
                                ref={scrollContainerRef}
                                onTouchStart={handleTouchStart}
                                onTouchEnd={handleTouchEnd}
                                className="flex items-center justify-center w-full h-full overflow-hidden"
                            >
                                {cards.map((card, index) => (
                                    <div
                                        key={card.id}
                                        className={`flex-shrink-0 w-full h-full flex items-center justify-center transition-opacity duration-300 ${
                                            index === currentIndex ? 'opacity-100' : 'opacity-0 pointer-events-none absolute'
                                        }`}
                                    >
                                        <div className="px-4 py-8">
                                            <Card
                                                item={card}
                                                onDelete={handleDelete}
                                                onEdit={handleEdit}
                                                canEdit={canManageCard(card)}
                                                canDelete={canManageCard(card)}
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Left Navigation Button */}
                            {currentIndex > 0 && (
                                <button
                                    onClick={scrollLeft}
                                    className="absolute top-1/2 transform -translate-y-1/2 bg-white bg-opacity-80 hover:bg-opacity-100 shadow-lg rounded-full p-4 transition z-10 left-6"
                                    title="Previous card"
                                >
                                    <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                    </svg>
                                </button>
                            )}

                            {/* Right Navigation Button */}
                            {currentIndex < cards.length - 1 && (
                                <button
                                    onClick={scrollRight}
                                    className="absolute top-1/2 transform -translate-y-1/2 bg-white bg-opacity-80 hover:bg-opacity-100 shadow-lg rounded-full p-4 transition z-10 right-6"
                                    title="Next card"
                                >
                                    <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                    </svg>
                                </button>
                            )}

                            {/* Dots Indicator - Bottom */}
                            <div className="absolute bottom-8 left-0 right-0 flex justify-center gap-2 z-20">
                                {cards.map((_, index) => (
                                    <button
                                        key={index}
                                        onClick={() => scrollToCard(index)}
                                        className={`transition-all ${
                                            index === currentIndex
                                                ? 'bg-blue-600 w-8 h-3 rounded-full'
                                                : 'bg-gray-400 hover:bg-gray-500 w-3 h-3 rounded-full'
                                        }`}
                                        title={`Go to card ${index + 1}`}
                                    />
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            )}
        </>
    );
}

export default CardList
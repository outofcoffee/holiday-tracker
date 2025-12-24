import React, { useEffect, useRef, useState } from 'react';
import { Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import { useTracker } from '../../hooks/useTracker';
import {
  getRandomFact,
  getFactForCountry,
  holidayDeliveryItems,
  holidayIncomingItems,
  holidayAssets,
  holidayMessages,
  holidayColors,
} from '../../config';
import './holiday-character.css';

// Build a lookup map for delivery items from config
const deliveryItemsMap = new Map(holidayDeliveryItems.map((item) => [item.type, item]));

// Helper function to get the appropriate emoji for each item type
const getItemEmoji = (type: string): string => {
  const item = deliveryItemsMap.get(type);
  return item?.emoji || holidayDeliveryItems[0]?.emoji || '🎁';
};

// Helper function to get the appropriate font size for each item type
const getItemFontSize = (type: string): number => {
  const item = deliveryItemsMap.get(type);
  return item?.fontSize || 16;
};

// Helper function to get the appropriate border-radius for each item type
const getItemBorderRadius = (type: string): string => {
  const item = deliveryItemsMap.get(type);
  return item?.borderRadius || '50%';
};

// Helper function to get the size for each item type
const getItemSize = (type: string): number => {
  const item = deliveryItemsMap.get(type);
  return item?.size || 28;
};

// Helper function to get colors for each item type
const getItemColors = (type: string): string[] => {
  const item = deliveryItemsMap.get(type);
  return item?.colors || ['#FFCC80', '#FFE57F', '#CCFF90'];
};

// Interface for a delivery item
interface DeliveryItem {
  id: string;
  type: string;
  angle: number;
  distance: number;
  color: string;
  size: number;
  createdAt: number;
  opacity: number;
  scale: number;
  rotation: number;
  shouldRemove: boolean;
}

// Interface for an incoming item (mince pies)
interface IncomingItem {
  id: string;
  type: string;
  angle: number;
  distance: number;
  size: number;
  createdAt: number;
  opacity: number;
  scale: number;
  rotation: number;
  shouldRemove: boolean;
}

// Main component
const HolidayCharacter: React.FC<{ position: [number, number] }> = ({ position }) => {
  const { currentPosition } = useTracker();
  const [fact, setFact] = useState(getRandomFact());
  const [isAtCity, setIsAtCity] = useState(false);
  const [isDelivering, setIsDelivering] = useState(false);

  // Store delivery items with complete lifecycle management
  const [deliveryItems, setDeliveryItems] = useState<DeliveryItem[]>([]);

  // Store incoming items (mince pies) with complete lifecycle management
  const [incomingItems, setIncomingItems] = useState<IncomingItem[]>([]);

  // Track last spawn time to avoid too frequent spawning
  const lastSpawnTimeRef = useRef(0);
  const lastIncomingSpawnTimeRef = useRef(0);

  // Get all item types from config
  const itemTypes = holidayDeliveryItems.map((item) => item.type);

  // Update state based on character's position
  useEffect(() => {
    if (currentPosition) {
      // Check if character is at a city
      const atCity =
        currentPosition.currentCity &&
        currentPosition.nextCity &&
        currentPosition.currentCity.id === currentPosition.nextCity.id;

      // Whether we should be showing delivery items
      const shouldDeliver = atCity || (currentPosition.overLand ?? true);

      setIsAtCity(!!atCity);
      setIsDelivering(!!shouldDeliver);
    }
  }, [currentPosition]);

  // Update fact when the character reaches a new city
  useEffect(() => {
    if (currentPosition?.currentCity) {
      const countryFact = getFactForCountry(currentPosition.currentCity.country);
      setFact(countryFact || getRandomFact());
    }
  }, [currentPosition?.currentCity?.id, currentPosition?.currentCity]);

  // Animation loop for items
  useEffect(() => {
    // Skip if not delivering
    if (!isDelivering) return;

    // Spawn new items occasionally
    const now = Date.now();
    const timeSinceLastSpawn = now - lastSpawnTimeRef.current;
    const spawnInterval = isAtCity ? 1800 : 3000;

    if (timeSinceLastSpawn >= spawnInterval) {
      lastSpawnTimeRef.current = now;

      // Add new item(s)
      const numItemsToSpawn = isAtCity ? Math.floor(Math.random() * 3) + 1 : 1;

      const newItems: DeliveryItem[] = [];

      for (let i = 0; i < numItemsToSpawn; i++) {
        // Determine type based on location and randomness
        let type: string;

        if (isAtCity) {
          // Cities get more varied items - weighted distribution
          const itemTypeRoll = Math.random();
          if (itemTypeRoll > 0.65 && itemTypes.length > 1) {
            type = itemTypes[1]; // Second item type (e.g., basket, stocking)
          } else if (itemTypeRoll > 0.35 && itemTypes.length > 2) {
            type = itemTypes[2]; // Third item type (e.g., candy)
          } else {
            type = itemTypes[0]; // First item type (e.g., egg, present)
          }
        } else {
          // Over regular land - simpler distribution
          const itemTypeRoll = Math.random();
          if (itemTypeRoll > 0.8 && itemTypes.length > 1) {
            type = itemTypes[1];
          } else if (itemTypeRoll > 0.5 && itemTypes.length > 2) {
            type = itemTypes[2];
          } else {
            type = itemTypes[0];
          }
        }

        // Calculate radial position
        const angle = Math.random() * Math.PI * 2;

        // Get size from config
        const size = getItemSize(type);

        // Pick a color from the item's palette
        const colors = getItemColors(type);
        const color = colors[Math.floor(Math.random() * colors.length)];

        // Create new item
        newItems.push({
          id: `${type}-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
          type,
          angle,
          distance: 30, // Start at character's edge
          color,
          size,
          createdAt: now,
          opacity: 0, // Start invisible
          scale: 0.7, // Start small
          rotation: Math.random() * 10 - 5,
          shouldRemove: false,
        });
      }

      // Add new items to state
      setDeliveryItems((prev) => [...prev, ...newItems]);
    }

    // Animation frame update all items
    const itemLifetime = 6000; // 6 seconds total lifetime

    // Animation loop
    const animationFrame = requestAnimationFrame(() => {
      setDeliveryItems((prevItems) => {
        if (prevItems.length === 0) return prevItems;

        return prevItems
          .map((item) => {
            const itemAge = now - item.createdAt;

            // Phase 1: Appear/Pop (0-10% of lifetime)
            if (itemAge < itemLifetime * 0.1) {
              const progress = itemAge / (itemLifetime * 0.1);
              return {
                ...item,
                opacity: Math.min(0.95, progress * 0.95),
                scale: 0.7 + progress * 0.4, // Grow to 1.1
              };
            }
            // Phase 2: Stable/Moving (10-70% of lifetime)
            else if (itemAge < itemLifetime * 0.7) {
              const progress = (itemAge - itemLifetime * 0.1) / (itemLifetime * 0.6);
              return {
                ...item,
                opacity: 0.95,
                scale: 1.1 - progress * 0.15, // Shrink slightly to 0.95
                distance: 30 + progress * 45, // Move outward faster and further
              };
            }
            // Phase 3: Fade Out (70-100% of lifetime)
            else if (itemAge < itemLifetime) {
              const progress = (itemAge - itemLifetime * 0.7) / (itemLifetime * 0.3);
              return {
                ...item,
                opacity: 0.95 * (1 - progress), // Fade to 0
                scale: 0.95 - progress * 0.15, // Continue shrinking
                distance: 75 + progress * 15, // Continue moving further
              };
            }
            // Ready for removal
            else {
              return {
                ...item,
                opacity: 0,
                shouldRemove: true,
              };
            }
          })
          .filter((item) => !item.shouldRemove); // Remove items marked for deletion
      });
    });

    // Cleanup animation frame
    return () => cancelAnimationFrame(animationFrame);
  }, [isDelivering, isAtCity, deliveryItems, itemTypes]);

  // Animation loop for incoming items (e.g., mince pies)
  useEffect(() => {
    // Skip if incoming items are not enabled or not delivering
    if (!holidayIncomingItems?.enabled || !isDelivering) return;

    // Spawn new incoming items occasionally
    const now = Date.now();
    const timeSinceLastSpawn = now - lastIncomingSpawnTimeRef.current;
    const spawnInterval = isAtCity
      ? holidayIncomingItems.spawnIntervalCity
      : holidayIncomingItems.spawnIntervalLand;

    if (timeSinceLastSpawn >= spawnInterval) {
      lastIncomingSpawnTimeRef.current = now;

      // Add new incoming item(s)
      const numItemsToSpawn = isAtCity ? Math.floor(Math.random() * 2) + 1 : 1;

      const newItems: IncomingItem[] = [];

      for (let i = 0; i < numItemsToSpawn; i++) {
        // Calculate radial position
        const angle = Math.random() * Math.PI * 2;

        // Create new incoming item starting from far away
        newItems.push({
          id: `incoming-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
          type: 'incoming',
          angle,
          distance: 90, // Start far away
          size: holidayIncomingItems.size,
          createdAt: now,
          opacity: 0, // Start invisible
          scale: 0.7, // Start small (like delivery items)
          rotation: Math.random() * 10 - 5, // Small random rotation
          shouldRemove: false,
        });
      }

      // Add new items to state
      setIncomingItems((prev) => [...prev, ...newItems]);
    }

    // Animation frame update all incoming items
    const itemLifetime = 6000; // 6 seconds total lifetime (same as delivery items)

    // Animation loop
    const animationFrame = requestAnimationFrame(() => {
      setIncomingItems((prevItems) => {
        if (prevItems.length === 0) return prevItems;

        return prevItems
          .map((item) => {
            const itemAge = now - item.createdAt;

            // Phase 1: Appear/Pop (0-10% of lifetime) - REVERSE of delivery items
            if (itemAge < itemLifetime * 0.1) {
              const progress = itemAge / (itemLifetime * 0.1);
              return {
                ...item,
                opacity: Math.min(0.95, progress * 0.95),
                scale: 0.7 + progress * 0.4, // Grow to 1.1
                distance: 90, // Stay at starting distance
              };
            }
            // Phase 2: Moving Inward (10-70% of lifetime) - OPPOSITE of outward movement
            else if (itemAge < itemLifetime * 0.7) {
              const progress = (itemAge - itemLifetime * 0.1) / (itemLifetime * 0.6);
              return {
                ...item,
                opacity: 0.95,
                scale: 1.1 - progress * 0.15, // Shrink slightly to 0.95
                distance: 90 - progress * 60, // Move INWARD from 90px to 30px
              };
            }
            // Phase 3: Fade Out (70-100% of lifetime)
            else if (itemAge < itemLifetime) {
              const progress = (itemAge - itemLifetime * 0.7) / (itemLifetime * 0.3);
              return {
                ...item,
                opacity: 0.95 * (1 - progress), // Fade to 0
                scale: 0.95 - progress * 0.15, // Continue shrinking
                distance: 30 - progress * 15, // Continue moving to center
              };
            }
            // Ready for removal
            else {
              return {
                ...item,
                opacity: 0,
                shouldRemove: true,
              };
            }
          })
          .filter((item) => !item.shouldRemove); // Remove items marked for deletion
      });
    });

    // Cleanup animation frame
    return () => cancelAnimationFrame(animationFrame);
  }, [isDelivering, isAtCity, incomingItems]);

  // Create custom character icon including delivery items and incoming mince pies
  const icon = L.divIcon({
    className: 'holiday-character-container',
    iconSize: [150, 150],
    iconAnchor: [75, 75],
    popupAnchor: [0, -75],
    html: `
      <div class="holiday-character-marker">
        ${deliveryItems
          .map(
            (item) => `
          <div class="delivery-item ${item.type}" style="
            position: absolute;
            left: 50%;
            top: 50%;
            width: ${item.size}px;
            height: ${item.size}px;
            background-color: ${item.color};
            border-radius: ${getItemBorderRadius(item.type)};
            border: 2px solid white;
            box-shadow: 0 0 5px rgba(0,0,0,0.5);
            z-index: 99;
            display: flex;
            justify-content: center;
            align-items: center;
            opacity: ${item.opacity};
            transform: translate(-50%, -50%)
                       rotate(${item.rotation}deg)
                       translate(${Math.cos(item.angle) * item.distance}px,
                                 ${Math.sin(item.angle) * item.distance}px)
                       scale(${item.scale});
          ">
            <div style="font-size: ${getItemFontSize(item.type)}px; font-weight: bold;">
              ${getItemEmoji(item.type)}
            </div>
          </div>
        `
          )
          .join('')}
        ${
          holidayIncomingItems?.enabled && holidayIncomingItems
            ? incomingItems
                .map(
                  (item) => `
          <div class="incoming-item" style="
            position: absolute;
            left: 50%;
            top: 50%;
            width: ${item.size}px;
            height: ${item.size}px;
            background-color: ${holidayIncomingItems!.backgroundColor};
            border-radius: 50%;
            border: 2px solid ${holidayIncomingItems!.borderColor};
            box-shadow: 0 0 5px rgba(0,0,0,0.5);
            z-index: 98;
            display: flex;
            justify-content: center;
            align-items: center;
            opacity: ${item.opacity};
            transform: translate(-50%, -50%)
                       rotate(${item.rotation}deg)
                       translate(${Math.cos(item.angle) * item.distance}px,
                                 ${Math.sin(item.angle) * item.distance}px)
                       scale(${item.scale});
          ">
            <div style="font-size: 16px; font-weight: bold;">
              ${holidayIncomingItems!.emoji}
            </div>
          </div>
        `
                )
                .join('')
            : ''
        }
        <div class="character-image">
          <img src="${holidayAssets.characterImage}" alt="${holidayAssets.characterAlt}" />
        </div>
      </div>
    `,
  });

  return (
    <Marker position={position} icon={icon} zIndexOffset={1000}>
      <Popup className="character-popup">
        <div className="text-center">
          <h3 className="font-bold text-lg" style={{ color: holidayColors.primary }}>
            {holidayMessages.characterName}
          </h3>
          {currentPosition?.currentCity && (
            <div>
              {isAtCity ? (
                <p>{holidayMessages.popupDeliveringMessage(currentPosition.currentCity.name)}</p>
              ) : (
                <p>
                  {holidayMessages.popupTravelingMessage(
                    currentPosition.currentCity.name,
                    currentPosition.nextCity?.name || ''
                  )}
                </p>
              )}
            </div>
          )}
          <div
            className="mt-2 p-2 rounded-lg"
            style={{ backgroundColor: holidayColors.accent }}
          >
            <p className="text-sm italic">{fact.text}</p>
          </div>
        </div>
      </Popup>
    </Marker>
  );
};

export default HolidayCharacter;

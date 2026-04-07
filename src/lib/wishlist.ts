const STORAGE_KEY = "gb_wishlist";

export function getWishlist(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

export function isInWishlist(carId: string): boolean {
  return getWishlist().includes(carId);
}

export function toggleWishlist(carId: string): boolean {
  const list = getWishlist();
  const index = list.indexOf(carId);
  if (index > -1) {
    list.splice(index, 1);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
    return false; // removed
  } else {
    list.push(carId);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
    return true; // added
  }
}

export function removeFromWishlist(carId: string): void {
  const list = getWishlist().filter((id) => id !== carId);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
}

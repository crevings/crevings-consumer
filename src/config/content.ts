/**
 * Static UI content that does not come from the backend.
 * Kept out of feature code so it can be swapped for API data later.
 */

export interface Category {
  name: string;
  image: string;
}

export const MIND_CATEGORIES: Category[] = [
  { name: "Burgers", image: "/categories/Burger.png" },
  { name: "Pizzas", image: "/categories/Pizza.png" },
  { name: "Chole Bhature", image: "/categories/Chola Bhatura.png" },
  { name: "Momos", image: "/categories/Dimsums.png" },
  { name: "Idli", image: "/categories/Idli.png" },
  { name: "Juices", image: "/categories/Juices.png" },
  { name: "Noodles", image: "/categories/Noodles.png" },
  { name: "Paratha", image: "/categories/Paratha.png" },
  { name: "Pasta", image: "/categories/Pasta.png" },
  { name: "Pastry", image: "/categories/Pastry.png" },
  { name: "Rice & Biryani", image: "/categories/Rice.png" },
  { name: "Sandwich", image: "/categories/Sandwhich.png" },
  { name: "Shakes", image: "/categories/Shakes.png" },
  { name: "Sweets", image: "/categories/Sweets.png" },
  { name: "Tea & Chai", image: "/categories/Tea.png" },
];

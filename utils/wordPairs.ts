export interface WordPair {
    civilian: string;
    undercover: string;
  }

  export const wordPairs: WordPair[] = [
    { civilian: "Apple", undercover: "Pear" },
    { civilian: "Dog", undercover: "Wolf" },
    { civilian: "Sun", undercover: "Moon" },
    { civilian: "Chair", undercover: "Stool" },
    { civilian: "Coffee", undercover: "Tea" },
    { civilian: "Car", undercover: "Bicycle" },
    { civilian: "Book", undercover: "Magazine" },
    { civilian: "Pizza", undercover: "Burger" },
    { civilian: "Ocean", undercover: "Lake" },
    { civilian: "Guitar", undercover: "Violin" },
    { civilian: "Summer", undercover: "Winter" },
    { civilian: "Doctor", undercover: "Nurse" },
    { civilian: "Movie", undercover: "TV Show" },
    { civilian: "Password", undercover: "Username"},
    { civilian: "Milk", undercover: "Water"},
    { civilian: "Beach", undercover: "Desert"},
    // Add more pairs as desired!
  ];

  // Helper function to get a random pair
  export function getRandomWordPair(): WordPair {
    const randomIndex = Math.floor(Math.random() * wordPairs.length);
    return wordPairs[randomIndex];
  }
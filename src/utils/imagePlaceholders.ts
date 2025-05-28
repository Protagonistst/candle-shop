/**
 * Generates a placeholder image URL based on the requested path.
 * This prevents 404 errors when image files don't exist.
 */
export const getImageUrl = (path: string): string => {
  // Check if the path is for a product
  if (path.includes('candle-')) {
    const candleNumber = path.match(/candle-(\d+)/)?.[1] || '1';
    const colors = ['#fbbf24', '#f59e0b', '#d97706', '#92400e', '#78350f', '#b45309'];
    const colorIndex = (parseInt(candleNumber) - 1) % colors.length;
    const color = colors[colorIndex];
    
    return `data:image/svg+xml,%3Csvg width='400' height='400' xmlns='http://www.w3.org/2000/svg'%3E%3Crect width='100%25' height='100%25' fill='%23f8f0e3'/%3E%3Crect x='150' y='100' width='100' height='200' rx='5' fill='${color.replace('#', '%23')}'/%3E%3Ccircle cx='200' cy='100' r='20' fill='%23ffedd5'/%3E%3Ctext x='200' y='250' font-family='Arial' font-size='16' text-anchor='middle' fill='%2378350f'%3ECandle ${candleNumber}%3C/text%3E%3C/svg%3E`;
  }
  
  // Check if the path is for a team member
  if (path.includes('team-member-')) {
    return `data:image/svg+xml,%3Csvg width='400' height='400' xmlns='http://www.w3.org/2000/svg'%3E%3Crect width='100%25' height='100%25' fill='%23f5f5f5'/%3E%3Ccircle cx='200' cy='150' r='100' fill='%23e5e5e5'/%3E%3Ccircle cx='200' cy='120' r='30' fill='%23d4d4d4'/%3E%3Cpath d='M140,220 Q200,280 260,220' fill='none' stroke='%23d4d4d4' stroke-width='8'/%3E%3Ctext x='200' y='350' font-family='Arial' font-size='16' text-anchor='middle' fill='%23525252'%3ETeam Member%3C/text%3E%3C/svg%3E`;
  }
  
  // Check if the path is for a scent
  if (path.includes('-scents.')) {
    const scentType = path.match(/([a-z]+)-scents/)?.[1] || 'floral';
    const colors: Record<string, string> = {
      floral: '#fbcfe8',
      woody: '#fef3c7',
      citrus: '#fef08a',
      spicy: '#fee2e2',
      fresh: '#dbeafe',
      gourmand: '#d6d3d1'
    };
    const color = colors[scentType] || '#f5f5f5';
    
    return `data:image/svg+xml,%3Csvg width='400' height='400' xmlns='http://www.w3.org/2000/svg'%3E%3Crect width='100%25' height='100%25' fill='${color.replace('#', '%23')}'/%3E%3Ctext x='200' y='200' font-family='Arial' font-size='24' text-anchor='middle' fill='%23525252'%3E${scentType.charAt(0).toUpperCase() + scentType.slice(1)} Scents%3C/text%3E%3C/svg%3E`;
  }
  
  // For workshop image
  if (path.includes('workshop')) {
    return `data:image/svg+xml,%3Csvg width='400' height='400' xmlns='http://www.w3.org/2000/svg'%3E%3Crect width='100%25' height='100%25' fill='%23f8f0e3'/%3E%3Crect x='50' y='150' width='300' height='150' fill='%23d97706'/%3E%3Crect x='100' y='100' width='50' height='50' fill='%23fbbf24'/%3E%3Crect x='250' y='100' width='50' height='50' fill='%23fbbf24'/%3E%3Cpath d='M50,150 L200,50 L350,150' fill='%2392400e'/%3E%3Ctext x='200' y='350' font-family='Arial' font-size='24' text-anchor='middle' fill='%2378350f'%3EWorkshop%3C/text%3E%3C/svg%3E`;
  }
  
  // For map image
  if (path.includes('map')) {
    return `data:image/svg+xml,%3Csvg width='400' height='400' xmlns='http://www.w3.org/2000/svg'%3E%3Crect width='100%25' height='100%25' fill='%23f5f5f5'/%3E%3Cpath d='M100,100 L300,100 L300,300 L100,300 Z' fill='none' stroke='%23d4d4d4' stroke-width='2'/%3E%3Ccircle cx='200' cy='200' r='10' fill='%23ef4444'/%3E%3Cpath d='M150,150 L250,150 M150,200 L250,200 M150,250 L250,250 M150,150 L150,250 M200,150 L200,250 M250,150 L250,250' stroke='%23d4d4d4' stroke-width='1'/%3E%3Ctext x='200' y='350' font-family='Arial' font-size='24' text-anchor='middle' fill='%23525252'%3EMap%3C/text%3E%3C/svg%3E`;
  }
  
  // Default placeholder
  return `data:image/svg+xml,%3Csvg width='400' height='400' xmlns='http://www.w3.org/2000/svg'%3E%3Crect width='100%25' height='100%25' fill='%23f8f0e3'/%3E%3Ctext x='200' y='200' font-family='Arial' font-size='24' text-anchor='middle' fill='%2378350f'%3EImage Placeholder%3C/text%3E%3C/svg%3E`;
};

/**
 * Generate a fallback SVG placeholder for missing product images
 * @param productName The name of the product for the alt text
 * @returns An SVG data URL
 */
export const getImageUrlFallback = (productName: string = 'Candle'): string => {
  // Create a simple SVG placeholder with the first letter of the product name
  const firstLetter = productName.charAt(0).toUpperCase();
  const color = getColorFromString(productName);
  
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="300" height="300" viewBox="0 0 300 300">
      <rect width="300" height="300" fill="${color}" />
      <text x="50%" y="50%" font-family="Arial" font-size="120" font-weight="bold" text-anchor="middle" dominant-baseline="middle" fill="white">
        ${firstLetter}
      </text>
      <text x="50%" y="75%" font-family="Arial" font-size="24" text-anchor="middle" fill="white">
        ${productName}
      </text>
    </svg>
  `;
  
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
};

/**
 * Generate a consistent color based on a string input
 * @param str Input string
 * @returns Hex color code
 */
const getColorFromString = (str: string): string => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  
  // Generate colors in the amber/brown range for candles
  const h = Math.abs(hash) % 30 + 20; // Hue between 20-50 (amber/brown range)
  const s = Math.abs(hash) % 20 + 70; // Saturation between 70-90%
  const l = Math.abs(hash) % 15 + 35; // Lightness between 35-50%
  
  return `hsl(${h}, ${s}%, ${l}%)`;
}; 
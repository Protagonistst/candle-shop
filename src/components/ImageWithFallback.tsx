import { useState, useEffect } from 'react';
import { getImageUrl } from '../utils/imagePlaceholders';

interface ImageWithFallbackProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  fallbackSrc?: string;
}

const ImageWithFallback: React.FC<ImageWithFallbackProps> = ({ 
  src, 
  alt, 
  fallbackSrc,
  className,
  ...props 
}) => {
  const [imgSrc, setImgSrc] = useState<string>(src);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [hasError, setHasError] = useState<boolean>(false);

  useEffect(() => {
    // Reset states when src changes
    setImgSrc(src);
    setIsLoading(true);
    setHasError(false);
  }, [src]);

  const handleError = () => {
    if (imgSrc !== fallbackSrc) {
      setHasError(true);
      setImgSrc(fallbackSrc || getImageUrl(alt));
    }
  };

  const handleLoad = () => {
    setIsLoading(false);
  };

  return (
    <div className={`relative ${className || ''}`}>
       {isLoading && !hasError && (
        <div className="absolute inset-0 flex items-center justify-center bg-amber-50">
          <div className="w-8 h-8 border-4 border-amber-300 border-t-amber-600 rounded-full animate-spin"></div>
        </div>
      )}
      <img
        src={imgSrc}
        alt={alt}
        onError={handleError}
        onLoad={handleLoad}
        className={`w-full h-full object-cover ${isLoading ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300`}
        {...props}
      />
    </div>
  );
};

export default ImageWithFallback; 
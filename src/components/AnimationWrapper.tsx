import React, { useEffect, useState, useRef } from 'react';

interface AnimationWrapperProps {
  children: React.ReactNode;
  animation: 
    | 'slideIn' 
    | 'fadeIn' 
    | 'slideInFromBottom' 
    | 'slideInFromRight' 
    | 'slideInFromLeft'
    | 'zoomIn'
    | 'bounce'
    | 'pulse'
    | 'float'
    | 'glow'
    | 'heartbeat'
    | 'shake'
    | 'sparkle';
  duration?: number;
  delay?: number;
  infinite?: boolean;
  trigger?: 'onMount' | 'onVisible' | 'onHover' | 'onClick';
  className?: string;
  style?: React.CSSProperties;
  onAnimationEnd?: () => void;
}

const AnimationWrapper: React.FC<AnimationWrapperProps> = ({
  children,
  animation,
  duration = 0.5,
  delay = 0,
  infinite = false,
  trigger = 'onMount',
  className = '',
  style = {},
  onAnimationEnd
}) => {
  const [isAnimating, setIsAnimating] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const elementRef = useRef<HTMLDivElement>(null);

  const getAnimationCSS = () => {
    const iterationCount = infinite ? 'infinite' : '1';
    const animationDelay = delay > 0 ? `${delay}s` : '0s';
    
    switch (animation) {
      case 'slideIn':
        return {
          animation: isAnimating ? `slideIn ${duration}s ease-out ${animationDelay} ${iterationCount}` : 'none'
        };
      case 'fadeIn':
        return {
          animation: isAnimating ? `fadeIn ${duration}s ease-in-out ${animationDelay} ${iterationCount}` : 'none'
        };
      case 'slideInFromBottom':
        return {
          animation: isAnimating ? `slideInFromBottom ${duration}s ease-out ${animationDelay} ${iterationCount}` : 'none'
        };
      case 'slideInFromRight':
        return {
          animation: isAnimating ? `slideInFromRight ${duration}s ease-out ${animationDelay} ${iterationCount}` : 'none'
        };
      case 'slideInFromLeft':
        return {
          animation: isAnimating ? `slideInFromLeft ${duration}s ease-out ${animationDelay} ${iterationCount}` : 'none'
        };
      case 'zoomIn':
        return {
          animation: isAnimating ? `zoomIn ${duration}s ease-out ${animationDelay} ${iterationCount}` : 'none'
        };
      case 'bounce':
        return {
          animation: isAnimating ? `bounce ${duration}s ease-in-out ${animationDelay} ${iterationCount}` : 'none'
        };
      case 'pulse':
        return {
          animation: isAnimating ? `pulse ${duration}s ease-in-out ${animationDelay} ${iterationCount}` : 'none'
        };
      case 'float':
        return {
          animation: isAnimating ? `float ${duration}s ease-in-out ${animationDelay} ${iterationCount}` : 'none'
        };
      case 'glow':
        return {
          animation: isAnimating ? `glow ${duration}s ease-in-out ${animationDelay} ${iterationCount}` : 'none'
        };
      case 'heartbeat':
        return {
          animation: isAnimating ? `heartbeat ${duration}s ease-in-out ${animationDelay} ${iterationCount}` : 'none'
        };
      case 'shake':
        return {
          animation: isAnimating ? `shake ${duration}s ease-in-out ${animationDelay} ${iterationCount}` : 'none'
        };
      case 'sparkle':
        return {
          animation: isAnimating ? `sparkle ${duration}s ease-in-out ${animationDelay} ${iterationCount}` : 'none'
        };
      default:
        return {};
    }
  };

  // Intersection Observer for 'onVisible' trigger
  useEffect(() => {
    if (trigger !== 'onVisible') return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !isVisible) {
          setIsVisible(true);
          setIsAnimating(true);
        }
      },
      { threshold: 0.1 }
    );

    if (elementRef.current) {
      observer.observe(elementRef.current);
    }

    return () => {
      if (elementRef.current) {
        observer.unobserve(elementRef.current);
      }
    };
  }, [trigger, isVisible]);

  // Mount trigger
  useEffect(() => {
    if (trigger === 'onMount') {
      const timer = setTimeout(() => {
        setIsAnimating(true);
      }, 50); // Small delay to ensure DOM is ready

      return () => clearTimeout(timer);
    }
  }, [trigger]);

  // Animation end handler
  useEffect(() => {
    if (!isAnimating || infinite) return;

    const timer = setTimeout(() => {
      setIsAnimating(false);
      onAnimationEnd?.();
    }, (duration + delay) * 1000);

    return () => clearTimeout(timer);
  }, [isAnimating, duration, delay, infinite, onAnimationEnd]);

  const handleClick = () => {
    if (trigger === 'onClick') {
      setIsAnimating(!isAnimating);
    }
  };

  const handleMouseEnter = () => {
    if (trigger === 'onHover') {
      setIsAnimating(true);
    }
  };

  const handleMouseLeave = () => {
    if (trigger === 'onHover' && !infinite) {
      setIsAnimating(false);
    }
  };

  const animationStyle = getAnimationCSS();

  return (
    <div
      ref={elementRef}
      className={className}
      style={{
        ...style,
        ...animationStyle,
        cursor: trigger === 'onClick' ? 'pointer' : style.cursor
      }}
      onClick={handleClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {children}
    </div>
  );
};

// Specialized animation components for common use cases
export const FloatingElement: React.FC<{ children: React.ReactNode; className?: string }> = ({ 
  children, 
  className = '' 
}) => (
  <AnimationWrapper animation="float" duration={3} infinite trigger="onMount" className={className}>
    {children}
  </AnimationWrapper>
);

export const PulsingElement: React.FC<{ children: React.ReactNode; className?: string }> = ({ 
  children, 
  className = '' 
}) => (
  <AnimationWrapper animation="pulse" duration={2} infinite trigger="onMount" className={className}>
    {children}
  </AnimationWrapper>
);

export const GlowingElement: React.FC<{ children: React.ReactNode; className?: string }> = ({ 
  children, 
  className = '' 
}) => (
  <AnimationWrapper animation="glow" duration={2} infinite trigger="onMount" className={className}>
    {children}
  </AnimationWrapper>
);

export const SlideInElement: React.FC<{ 
  children: React.ReactNode; 
  direction?: 'up' | 'down' | 'left' | 'right';
  delay?: number;
  className?: string;
}> = ({ 
  children, 
  direction = 'up',
  delay = 0,
  className = '' 
}) => {
  const animationMap = {
    up: 'slideInFromBottom',
    down: 'slideIn',
    left: 'slideInFromRight',
    right: 'slideInFromLeft'
  };

  return (
    <AnimationWrapper 
      animation={animationMap[direction] as any} 
      delay={delay} 
      trigger="onVisible" 
      className={className}
    >
      {children}
    </AnimationWrapper>
  );
};

export const ZoomInElement: React.FC<{ 
  children: React.ReactNode; 
  delay?: number;
  className?: string;
}> = ({ 
  children, 
  delay = 0,
  className = '' 
}) => (
  <AnimationWrapper animation="zoomIn" delay={delay} trigger="onVisible" className={className}>
    {children}
  </AnimationWrapper>
);

export const HeartbeatElement: React.FC<{ children: React.ReactNode; className?: string }> = ({ 
  children, 
  className = '' 
}) => (
  <AnimationWrapper animation="heartbeat" duration={1.5} infinite trigger="onMount" className={className}>
    {children}
  </AnimationWrapper>
);

export const ShakeElement: React.FC<{ 
  children: React.ReactNode; 
  trigger?: boolean;
  className?: string;
}> = ({ 
  children, 
  trigger: shouldShake = false,
  className = '' 
}) => {
  const [shakeCount, setShakeCount] = useState(0);

  useEffect(() => {
    if (shouldShake) {
      setShakeCount(prev => prev + 1);
    }
  }, [shouldShake]);

  return (
    <AnimationWrapper 
      key={shakeCount} // Force re-render to restart animation
      animation="shake" 
      duration={0.5} 
      trigger="onMount" 
      className={className}
    >
      {children}
    </AnimationWrapper>
  );
};

export default AnimationWrapper;
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useRef,
  type ReactNode,
  type FC,
} from 'react';
import { cn } from '@/lib/utils';

interface ProgressSliderContextType {
  active: string;
  progress: number;
  handleButtonClick: (value: string) => void;
  vertical: boolean;
  activeIndex: number;
  values: string[];
}

interface ProgressSliderProps {
  children: ReactNode;
  duration?: number;
  activeSlider: string;
  values: string[]; // Propiedad obligatoria para mayor fiabilidad
  className?: string;
}

interface SliderContentProps  { children: ReactNode; className?: string; }
interface SliderWrapperProps  { children: ReactNode; value: string; className?: string; }
interface ProgressBarProps    { children: ReactNode; className?: string; }
interface SliderBtnProps {
  children: ReactNode;
  value: string;
  className?: string;
  progressBarClass?: string;
}

const ProgressSliderContext = createContext<ProgressSliderContextType | undefined>(undefined);

export const useProgressSliderContext = (): ProgressSliderContextType => {
  const context = useContext(ProgressSliderContext);
  if (!context) throw new Error('useProgressSliderContext must be used within a ProgressSlider');
  return context;
};

export const ProgressSlider: FC<ProgressSliderProps> = ({
  children,
  duration = 5000,
  activeSlider,
  values,
  className,
}) => {
  const [active, setActive] = useState<string>(activeSlider);
  const [progress, setProgress] = useState<number>(0);
  const frame = useRef<number>(0);
  const firstFrameTime = useRef<number>(performance.now());
  const activeIndex = values.indexOf(active);

  useEffect(() => {
    if (!values || values.length === 0) return;

    const animate = (now: number) => {
      const elapsedTime = now - firstFrameTime.current;
      const timeFraction = elapsedTime / duration;

      if (timeFraction <= 1) {
        setProgress(timeFraction * 100);
        frame.current = requestAnimationFrame(animate);
      } else {
        const currentIndex = values.indexOf(active);
        const nextIndex = (currentIndex + 1) % values.length;
        setActive(values[nextIndex]);
        setProgress(0);
        firstFrameTime.current = performance.now();
      }
    };

    firstFrameTime.current = performance.now();
    frame.current = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(frame.current);
  }, [values, active, duration]);

  const handleButtonClick = (value: string) => {
    setActive(value);
    setProgress(0);
    firstFrameTime.current = performance.now();
  };

  return (
    <ProgressSliderContext.Provider value={{ active, progress, handleButtonClick, vertical: false, activeIndex, values }}>
      <div className={cn('relative', className)}>{children}</div>
    </ProgressSliderContext.Provider>
  );
};

export const SliderContent: FC<SliderContentProps> = ({ children, className }) => {
  const { activeIndex } = useProgressSliderContext();
  return (
    <div className={cn('overflow-hidden w-full h-full', className)}>
      <div 
        className="flex transition-transform duration-700 ease-in-out h-full w-full"
        style={{ transform: `translateX(-${activeIndex * 100}%)` }}
      >
        {children}
      </div>
    </div>
  );
};

export const SliderWrapper: FC<SliderWrapperProps> = ({ children, value, className }) => {
  return (
    <div className={cn('flex-shrink-0 w-full h-full', className)}>
      {children}
    </div>
  );
};

export const SliderBtnGroup: FC<ProgressBarProps> = ({ children, className }) => {
  const { active } = useProgressSliderContext();
  const groupRef = useRef<HTMLDivElement>(null);

  // Auto-scroll para móvil — sin tocar el scroll de la página
  useEffect(() => {
    const container = groupRef.current;
    if (!container) return;
    const activeBtn = container.querySelector(`[data-value="${active}"]`) as HTMLElement | null;
    if (!activeBtn) return;
    const pageBefore = window.scrollY;
    container.scrollLeft = activeBtn.offsetLeft - (container.offsetWidth - activeBtn.offsetWidth) / 2;
    if (window.scrollY !== pageBefore) window.scrollTo(0, pageBefore);
  }, [active]);

  return (
    <div ref={groupRef} className={cn('', className)}>{children}</div>
  );
};

export const SliderBtn: FC<SliderBtnProps> = ({
  children,
  value,
  className,
  progressBarClass,
}) => {
  const { active, progress, handleButtonClick, vertical } = useProgressSliderContext();
  return (
    <button
      type="button"
      data-value={value}
      className={cn(
        `relative transition-opacity duration-300 ${active === value ? 'opacity-100' : 'opacity-50 hover:opacity-100'}`,
        className
      )}
      onClick={() => handleButtonClick(value)}
    >
      {children}
      <div
        className='absolute inset-0 overflow-hidden -z-10 max-h-full max-w-full'
        role='progressbar'
        aria-valuenow={active === value ? Math.round(progress) : 0}
      >
        <div
          className={cn('absolute left-0 top-0 transition-all duration-150 ease-linear', progressBarClass)}
          style={{
            [vertical ? 'height' : 'width']: active === value ? `${progress}%` : '0%',
            [vertical ? 'width' : 'height']: '100%',
          }}
        />
      </div>
    </button>
  );
};

 import { motion, Transition, Variants } from "framer-motion";
 import { ReactNode, useEffect, useRef } from "react";
 import { cn } from "@/lib/utils";
 
 interface PageTransitionProps {
   children: ReactNode;
   className?: string;
 }
 
 const pageVariants: Variants = {
   initial: {
     opacity: 0,
     y: 12,
     // Use translate3d for GPU acceleration
     transform: "translate3d(0, 12px, 0)",
   },
   in: {
     opacity: 1,
     y: 0,
     transform: "translate3d(0, 0, 0)",
   },
   out: {
     opacity: 0,
     y: -12,
     transform: "translate3d(0, -12px, 0)",
   },
 };
 
 const pageTransition: Transition = {
   type: "tween",
   ease: "easeOut" as const,
   duration: 0.25,
 };
 
 export function PageTransition({ children, className }: PageTransitionProps) {
   const containerRef = useRef<HTMLDivElement>(null);
 
   // Apply will-change before animation, remove after for memory optimization
   useEffect(() => {
     const element = containerRef.current;
     if (element) {
       element.style.willChange = "transform, opacity";
       
       // Remove will-change after animation completes to free GPU memory
       const timeout = setTimeout(() => {
         element.style.willChange = "auto";
       }, 300); // slightly longer than animation duration
       
       return () => clearTimeout(timeout);
     }
   }, []);
 
   return (
     <motion.div
       ref={containerRef}
       initial="initial"
       animate="in"
       exit="out"
       variants={pageVariants}
       transition={pageTransition}
       className={cn(
         // Force GPU layer creation for smoother animations
         "backface-visibility-hidden transform-gpu",
         className
       )}
       style={{
         // Ensure hardware acceleration
         WebkitBackfaceVisibility: "hidden",
         backfaceVisibility: "hidden",
         perspective: 1000,
       }}
     >
       {children}
     </motion.div>
   );
 }
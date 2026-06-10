// import { useState, useEffect } from "react";
// import { motion, AnimatePresence } from "framer-motion";
// import { Link } from "react-router-dom";
// import foxyMascot from "@/assets/foxy-mascot.png";

// const FoxyWelcome = () => {
//   const [show, setShow] = useState(false);

//   useEffect(() => {
//     const seen = sessionStorage.getItem("foxy-welcomed");
//     if (!seen) {
//       const timer = setTimeout(() => setShow(true), 1500);
//       return () => clearTimeout(timer);
//     }
//   }, []);

//   const dismiss = () => {
//     setShow(false);
//     sessionStorage.setItem("foxy-welcomed", "true");
//   };

//   return (
//     <AnimatePresence>
//       {show && (
//         <>
//           <motion.div
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             exit={{ opacity: 0 }}
//             className="fixed inset-0 bg-foreground/10 backdrop-blur-sm z-[100]"
//             onClick={dismiss}
//           />
//           <motion.div
//             initial={{ y: 100, opacity: 0, scale: 0.8 }}
//             animate={{ y: 0, opacity: 1, scale: 1 }}
//             exit={{ y: 100, opacity: 0, scale: 0.8 }}
//             transition={{ type: "spring", damping: 20, stiffness: 300 }}
//             className="fixed bottom-8 right-8 z-[101] glass-card-strong rounded-3xl p-6 max-w-sm shadow-2xl"
//           >
//             <div className="flex items-start gap-4">
//               <motion.img
//                 src={foxyMascot}
//                 alt="Foxy"
//                 className="w-16 h-16 shrink-0"
//                 animate={{ y: [0, -5, 0] }}
//                 transition={{ duration: 2, repeat: Infinity }}
//               />
//               <div>
//                 <h3 className="font-display font-bold text-lg">Welcome to EduVision AI! 🎉</h3>
//                 <p className="text-sm text-muted-foreground mt-1">
//                   I'm Foxy — your AI learning companion. Let me help you study smarter!
//                 </p>
//               </div>
//             </div>
//             <div className="flex gap-3 mt-4">
//               <Link
//                 to="/signup"
//                 onClick={dismiss}
//                 className="flex-1 text-center py-2.5 rounded-xl gradient-primary text-sm font-semibold hover-lift"
//               >
//                 Start Learning
//               </Link>
//               <button
//                 onClick={dismiss}
//                 className="flex-1 py-2.5 rounded-xl bg-muted text-sm font-medium hover:bg-muted/80 transition-colors"
//               >
//                 Maybe Later
//               </button>
//             </div>
//           </motion.div>
//         </>
//       )}
//     </AnimatePresence>
//   );
// };

// export default FoxyWelcome;

import { motion } from "framer-motion";

const WithMotion = (Component: React.ComponentType<any>) => {
  return (props: any) => (
    <motion.div
      style={{ flexGrow: 1 }}
      initial={{ opacity: 0, x: 200 }} // Initial state (hidden)
      animate={{ opacity: 1, x: 0 }} // Final state (visible)
    >
      <Component {...props} />
    </motion.div>
  );
};

export default WithMotion;

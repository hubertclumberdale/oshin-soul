import { motion } from "framer-motion";

const WithMotion = (Component: React.ComponentType<any>) => {
  return (props: any) => (
    <motion.div
      style={{ flexGrow: 1 }}
      initial={{ opacity: 0 }} // Initial state (hidden)
      animate={{ opacity: 1 }} // Final state (visible)
    >
      <Component {...props} />
    </motion.div>
  );
};

export default WithMotion;

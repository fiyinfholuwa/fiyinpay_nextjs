const AnimatedCounter = ({ amount }: { amount: number }) => (
  <span>{new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(amount)}</span>
);

export default AnimatedCounter;

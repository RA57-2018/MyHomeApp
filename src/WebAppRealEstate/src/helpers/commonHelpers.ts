export const toCamel = (s: string) => {
  return s.replace(/_([a-z])/g, (_, p1) => p1.toUpperCase());
};

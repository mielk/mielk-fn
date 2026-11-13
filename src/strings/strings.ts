export const capitalizeFirst = (str: string): string => {
  if (!str) return str;

  const index = str.search(/\S/);
  if (index === -1) return str;

  return str.slice(0, index) + str.charAt(index).toUpperCase() + str.slice(index + 1);
};

export const collapseWhitespace = (value: string): string => {
  const regex = /(^\s+|(?<=\s)\s|\s+$)/gi;
  return value.replace(regex, '');
};

export default { capitalizeFirst, collapseWhitespace };

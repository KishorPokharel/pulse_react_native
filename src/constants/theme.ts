export type Theme = {
  background: string;
  text: string;
  heart: string;
};

export const lightTheme: Theme = {
  background: "white",
  text: "#374151",
  heart: "#f43f5e",
};

export const darkTheme: Theme = {
  // background: "#171717",
  // text: "#e5e5e5",
  ...lightTheme,
};

export type Theme = {
  background: string;
  text: string;
};

export const lightTheme: Theme = {
  background: "white",
  text: "#374151",
};

export const darkTheme: Theme = {
  ...lightTheme,
};

// export const darkTheme: Theme = {
//   background: "#171717",
//   text: "white",
// };

import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { Tabs } from "expo-router";

export default function Layout() {
  return (
    <Tabs screenOptions={{ headerShown: false }}>
      <Tabs.Screen
        name="home"
        options={{
          title: "Home",
          tabBarIcon: ({ color }) => {
            return <MaterialIcons color={color} size={28} name={"home"} />;
          },
        }}
      />
      <Tabs.Screen
        name="search"
        options={{
          title: "Search",
          tabBarIcon: ({ color }) => {
            return <MaterialIcons color={color} size={28} name={"search"} />;
          },
        }}
      />
      <Tabs.Screen
        name="post"
        options={{
          title: "Add Post",
          tabBarIcon: ({ color }) => {
            return <MaterialIcons color={color} size={28} name={"add-box"} />;
          },
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ color }) => {
            return <MaterialIcons color={color} size={28} name={"person"} />;
          },
        }}
      />
    </Tabs>
  );
}

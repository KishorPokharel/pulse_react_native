import AppHeader from "@/src/components/appHeader";
import { useAuth } from "@/src/hooks/useAuth";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { Tabs } from "expo-router";

export default function Layout() {
  const { user } = useAuth();
  return (
    <Tabs
      screenOptions={{
        headerShown: true,
        header: (props) => <AppHeader name={user?.name || ""} />,
      }}
    >
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
        name="notifications"
        options={{
          title: "Notifications",
          tabBarIcon: ({ color }) => {
            return (
              <MaterialIcons color={color} size={28} name={"notifications"} />
            );
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

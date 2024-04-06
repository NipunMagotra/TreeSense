import Image from "next/image";
import GlobeMap from "./components/Globe";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <GlobeMap />
    </main>
  );
}

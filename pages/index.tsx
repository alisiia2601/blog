import Heading from "@components/heading";
import styles from "./Home.module.css";

export default function Home() {
  return (
    <div className="container">
      <Heading>Home</Heading>
      <p>Welcome to our Blog!</p>
      <p>Explore captivating stories, insightful articles, and more.</p>
    </div>
  );
}

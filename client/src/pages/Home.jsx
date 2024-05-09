/* eslint-disable react/prop-types */
import { useEffect } from "react";

function Home({ to }) {
  useEffect(() => {
    window.location.href = to;
  }, [to]);

  return null;
}

export default Home;

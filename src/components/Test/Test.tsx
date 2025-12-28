import { useEffect, useState } from "react";

const Test = () => {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    (async () => {
      try {
        const token = localStorage.getItem("token");

        const res = await fetch("http://localhost:8000/cars/", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const result = await res.json();
        console.log(result);
        setData(result);
      } catch (e) {
        console.log("error", e);
      }
    })();
  }, []);

  return <pre>{JSON.stringify(data, null, 2)}</pre>;
};

export default Test;

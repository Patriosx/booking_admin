import axios from "axios";
import { useEffect } from "react";
import { useState } from "react";

const useFetch = (url) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await axios.get(url);
      setData(res.data);
    } catch (err) {
      setError(err);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
    //leave the dependency [url] for instant search
  }, []);

  const reFetch = async () => {
    fetchData();
  };

  return { data, loading, error, reFetch };
};

export default useFetch;

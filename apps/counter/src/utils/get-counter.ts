export const getCounter = async (address: string) => {
  const res = await fetch(`https://toncenter.com/api/v3/runGetMethod`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      address: address,
      method: 'counter',
      stack: []
    }),
  });
  const data = await res.json();
  console.log(data);
};

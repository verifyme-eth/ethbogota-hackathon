async function comparePoaps(address1: string, address2: string) {
  const data1 = await fetch(`https://api.poap.tech/actions/scan/${address1}`, {
    headers: {
      "Content-Type": "application/json",
    },
  });

  const res1 = await data1.json();

  const data2 = await fetch(`https://api.poap.tech/actions/scan/${address2}`, {
    headers: {
      "Content-Type": "application/json",
    },
  });

  const res2 = await data2.json();

  const arr1 = [];

  for (const el in res1) {
    if (res1.hasOwnProperty(el)) {
      arr1.push(res1[el].event.id);
    }
  }

  const arr2: any[] = [];

  for (const el in res2) {
    if (res2.hasOwnProperty(el)) {
      arr2.push(res2[el].event.id);
    }
  }

  const common = arr1.filter((x) => arr2.includes(x) && x);

  return common;
}

export { comparePoaps };

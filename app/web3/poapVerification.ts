async function comparePoaps(adress1: string, adress2: string) {
  let data1 = await fetch(`https://api.poap.tech/actions/scan/${adress1}`, {
    headers: {
      "Content-Type": "application/json",
    },
  });
  let res1 = await data1.json();

  let data2 = await fetch(`https://api.poap.tech/actions/scan/${adress2}`, {
    headers: {
      "Content-Type": "application/json",
    },
  });
  let res2 = await data2.json();

  let arr1 = [];

  for (const el in res1) {
    if (res1.hasOwnProperty(el)) {
      arr1.push(res1[el].event.id);
    }
  }

  let arr2: any[] = [];

  for (const el in res2) {
    if (res2.hasOwnProperty(el)) {
      arr2.push(res2[el].event.id);
    }
  }

  let common = arr1.filter((x) => arr2.includes(x) && x);

  return common;
}

export { comparePoaps };

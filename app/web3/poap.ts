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

  const obj1: any = {};

  for (const el in res1) {
    if (res1.hasOwnProperty(el)) {
      let id = res1[el].event.id;
      obj1[id] = {
        id: id,
        name: res1[el].event.name,
        description: res1[el].event.description,
        image_url: res1[el].event.image_url,
      };
    }
  }

  const obj2: any = {};

  for (const el in res2) {
    if (res2.hasOwnProperty(el)) {
      let id = res2[el].event.id;
      obj2[id] = {
        id: id,
        name: res2[el].event.name,
        description: res2[el].event.description,
        image_url: res2[el].event.image_url,
      };
    }
  }

  const common: any = [];

  if (Object.keys(obj1).length >= Object.keys(obj2).length) {
    for (let el in obj1) {
      if (obj2.hasOwnProperty(el)) {
        common.push(obj1[el]);
      }
    }
  } else {
    for (let el in obj2) {
      if (obj1.hasOwnProperty(el)) {
        common.push(obj2[el]);
      }
    }
  }

  let arrLength = 0;
  let arrDiff = 0;

  if (common.length > 11) {
    arrLength = common.length;
    arrDiff = common.length - 11;
  }

  return { common, arrLength, arrDiff };
}

export { comparePoaps };

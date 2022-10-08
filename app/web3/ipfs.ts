// delete 'ipfs://' from string
const removeIpfsPrefix = (str: string): string => str.replace("ipfs://", "");

// add at beginning of string https://lens.infura-ipfs.io/ipfs/
const addIpfsPrefix = (str: string): string =>
  `https://lens.infura-ipfs.io/ipfs/${str}`;

export const transformToIpfsUrl = (str: string): string => {
  // check if string starts with ipfs://
  if (str.startsWith("ipfs://")) {
    const ipfsHash = removeIpfsPrefix(str);

    return addIpfsPrefix(ipfsHash);
  }

  return str;
};

export const transformToIpfsCoverImageUrl = (str: string): string => {
  const defaultCoverImage =
    "https://images.hola.com/imagenes/viajes/20220209204303/como-viajar-torres-del-paine-chile/1-49-229/shutterstock1680109243-a.jpg";

  if (str === null || str === undefined) {
    return defaultCoverImage;
  }

  // check if string starts with ipfs://
  if (str?.startsWith("ipfs://")) {
    const ipfsHash = removeIpfsPrefix(str);

    return addIpfsPrefix(ipfsHash);
  }

  return str;
};

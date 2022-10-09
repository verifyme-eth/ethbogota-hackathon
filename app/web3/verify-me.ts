function getRatioValidation(poaps: number, followers: number) {
  const POAPS_PER_FOLLOWER = 10;

  const ratio = (poaps * 100) / (followers * POAPS_PER_FOLLOWER);

  return ratio;
}

export { getRatioValidation };

function next(minute: number) {
  const now = new Date();
  const remainSeconds = 60 - now.getSeconds();
  const remainMinutes = now.getMinutes() % minute;

  const seconds = remainSeconds;
  const minutes = remainMinutes === 0 ? minute : minute - remainMinutes;

  if (seconds === 60) {
    return minutes * 60 * 1000;
  }
  return (minutes - 1) * 60 * 1000 + seconds * 1000;
}

export default next;

export const seconds = (time) => {
  return time.hour() * 60 * 60 + time.minute() * 60 + time.second()
}

import { r } from "tar";

export function makeMessagesLookTheWayIwant(data) {
  const allShortMessages = data.filter((item) => {
    return item.description.length < 50;
  });

  return allShortMessages;
}

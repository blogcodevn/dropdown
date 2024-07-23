const findScrollContainers = (element: HTMLElement | null): HTMLElement[] => {
  const scrollContainers: HTMLElement[] = [];
  let currentElement: HTMLElement | null = element;
  while (currentElement) {
    if (currentElement.scrollHeight > currentElement.clientHeight || currentElement.scrollWidth > currentElement.clientWidth) {
      scrollContainers.push(currentElement);
    }
    currentElement = currentElement.parentElement;
  }
  return scrollContainers;
};

export default findScrollContainers;

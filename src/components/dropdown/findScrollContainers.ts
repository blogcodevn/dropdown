const findScrollContainers = (element: HTMLElement | null): HTMLElement[] => {
  const scrollContainers: HTMLElement[] = [];
  let currentElement: HTMLElement | null = element;

  while (currentElement) {
    if (currentElement.scrollHeight > currentElement.clientHeight || currentElement.scrollWidth > currentElement.clientWidth) {
      scrollContainers.push(currentElement);
    }
    currentElement = currentElement.parentElement;
  }

  // Thêm html và body vào danh sách các phần tử có khả năng cuộn nếu chúng thực sự có khả năng cuộn
  const htmlElement = document.documentElement;
  const bodyElement = document.body;

  if (htmlElement.scrollHeight > htmlElement.clientHeight || htmlElement.scrollWidth > htmlElement.clientWidth) {
    scrollContainers.push(htmlElement);
  }

  if (bodyElement.scrollHeight > bodyElement.clientHeight || bodyElement.scrollWidth > bodyElement.clientWidth) {
    scrollContainers.push(bodyElement);
  }

  return scrollContainers;
};

export default findScrollContainers;
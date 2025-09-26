const dottedLine = "•".repeat(50);

export const printBanner = (title, message) => {
  console.log('\x1b[36m%s\x1b[0m', `${dottedLine}`);
  console.log('\x1b[32m%s\x1b[0m', `🚀 ${title}`);
  console.log('\x1b[37m%s\x1b[0m', `${message}`);
  console.log('\x1b[36m%s\x1b[0m', `${dottedLine}`);
};

module.exports = {
  std(msg) {
    process.stdout.write(msg + '\n');
  },
  err(msg) {
    process.stdout.error(msg + '\n');
  },
};

let io;

export const setIo = (newIo) => {
  io = newIo;
};

export const getIo = () => io;

export const emitToUser = (userId, event, data) => {
  if (io) {
    io.to(`user:${userId}`).emit(event, data);
  }
};

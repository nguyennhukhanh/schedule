import { Room } from '../../models/room';

export default async function incompetent(
  userId: any,
  roomId: string,
): Promise<boolean> {
  const room = await Room.findById(roomId);
  const isParticipant = room.participants.some(
    (participant) => participant == userId,
  );
  return isParticipant;
}

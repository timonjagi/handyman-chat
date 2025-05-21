import { z } from 'zod';
import { tool } from 'ai';

export const getHackathonInfo = tool({
  name: 'getHackathonInfo',
  description: 'Get information about the world\'s shortest hackathon',
  parameters: z.object({}),
  execute: async () => {
    // Mock data
    return { attendees: 1000 };
  },
});

export const tools = {
  getHackathonInfo,
};
